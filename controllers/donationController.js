const Donation = require("../models/DonationModel");

const addDonation = async (req, res) => {
    const {
        title,
        description,
        currentAmount,
        targetAmount,
        daysLeft,
        imageUrls,
        location,
        IBAN,
        BankName,
        AccountTitle
    } = req.body;

    try {
        // Ensure user is authenticated, else cannot add a donation
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        //check if all required fields are present
        if (!title || !description || !targetAmount || !daysLeft || !location || !IBAN || !BankName || !AccountTitle) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Ensure no duplicate donation is created
        const existingDonation = await Donation.findOne({ title, author: req.user._id });

        if (existingDonation) {
            return res.status(400).json({ message: 'Donation already exists' });
        }

        // Create the Fundraiser
        const newDonation = new Donation({
            author: req.user._id,
            image: imageUrls && imageUrls.length > 0
                ? imageUrls
                : ['/default-fundraiser-image.png'],
            title,
            description,
            currentAmount: currentAmount || 0,
            targetAmount,
            daysLeft,
            location,
            IBAN,
            BankName,
            AccountTitle
        });

        // Save the Fundraiser to the database
        const savedDonation = await newDonation.save();

        // Populate author of donation details
        await savedDonation.populate('author', 'name location image');

        // Sending the saved Fundraiser in the response
        res.status(201).json({ success: true, donation: savedDonation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteDonation = async (req, res) => {
    const DonationId = req.params.id;

    try {
        // Check if the Donation exists
        const Donation = await Donation.findById(DonationId);
        if (!Donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Remove the Donation
        await Donation.findByIdAndRemove(DonationId);

        // Send success response
        res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};


const closeDonation = async (req, res) => {
    const DonationId = req.params.id;

    try {
        // Check if the Donation exists
        const Donation = await Donation.findById(DonationId);
        if (!Donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Update the Donation's isOpen field to false
        Donation.isOpen = false;
        await Donation.save();

        // Send success response
        res.status(200).json({ message: 'Donation closed successfully' });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addDonation,
    deleteDonation,
    closeDonation
}