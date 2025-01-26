const Contribution = require("../models/ContributionModel");
const Donation = require("../models/DonationModel");

const getDonationContributions = async (req, res) => {
    const DonationId = req.params.id;

    try {
        // Fetch all contributions for the Donation
        const contributions = await Contribution.find({ donation: DonationId }).populate('donation', 'title').populate('donor', 'name location image');

        // Send the contributions in the response
        res.status(200).json({ success: true, contributions });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
}

const mongoose = require("mongoose");

const verifyContribution = async (req, res) => {
    const { id } = req.body;

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch and verify the contribution
        const contribution = await Contribution.findById(id).session(session);
        if (!contribution) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Contribution not found" });
        }

        if (contribution.verified) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Contribution is already verified" });
        }

        // Mark the contribution as verified
        contribution.verified = true;
        await contribution.save({ session });

        // Update the associated donation's currentAmount
        const donation = await Donation.findByIdAndUpdate(
            contribution.donation,
            {
                $inc: { currentAmount: contribution.amount }
            },
            { new: true, session }
        );

        if (!donation) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Donation not found" });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Respond with the updated contribution and donation
        res.status(200).json({
            success: true,
            contribution,
            donation,
        });
    } catch (err) {
        // Rollback the transaction on error
        await session.abortTransaction();
        session.endSession();

        // Handle errors
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getDonationContributions,
    verifyContribution
}
