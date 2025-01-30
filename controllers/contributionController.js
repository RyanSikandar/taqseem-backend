const Contribution = require("../models/ContributionModel");
const Donation = require("../models/DonationModel");
const mongoose = require("mongoose");
const getDonationContributions = async (req, res) => {
    const DonationId = req.params.id;

    try {
        // Fetch all contributions for the Donation
        const contributions = await Contribution.find({ donation: DonationId }).populate('donation', 'title').populate('donor', 'name location image').sort('-donatedAt');

        // Send the contributions in the response
        res.status(200).json({ success: true, contributions });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
}

const addContribution = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = req.user._id;
        const { amount } = req.body;
        const donationId = req.params.id;

        if (!amount) {
            return res.status(400).json({ message: "Amount is required" });
        }

        // Create a new contribution
        let contribution = await Contribution.create({
            donor: user,
            donation: donationId,
            amount
        });

        contribution = await contribution.populate([{
            path: 'donation',
            select: 'title currentAmount'
        }, {
            path: 'donor',
            select: 'name location image'
        }])

        res.status(201).json({ success: true, contribution });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const verifyContribution = async (req, res) => {
    const { id } = req.body;

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch and verify the contribution
        const contribution = await Contribution.findById(id)
            .populate({
                path: 'donation',
                populate: { path: 'author', select: '_id' }
            })
            .session(session);

        if (!contribution) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Contribution not found" });
        }

        // Check if current user matches donation author
        if (!contribution.donation.author._id.equals(req.user._id)) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Unauthorized to verify this contribution" });
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
    verifyContribution,
    addContribution
}
