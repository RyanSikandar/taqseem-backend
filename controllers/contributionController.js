const Contribution = require("../models/ContributionSchema");

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

module.exports = {
    getDonationContributions
}
