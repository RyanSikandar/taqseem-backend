const Contribution = require("../models/ContributionSchema");
const Donation = require("../models/DonationModel");

const addDonation = async (req, res) => {
    const {
        title,
        cause,
        donationUsage,
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

        // Check if all required fields are present
        if (!title || !cause || !donationUsage || !description || !targetAmount || !daysLeft || !location || !IBAN || !BankName || !AccountTitle) {
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
            image: imageUrls && imageUrls.length > 0 ? imageUrls : ['/default-fundraiser-image.png'],
            title,
            cause,
            donationUsage,
            description,
            currentAmount: currentAmount || 0,
            targetAmount,
            daysLeft,
            location,
            IBAN,
            BankName,
            AccountTitle,
            isCompleted: currentAmount >= targetAmount
        });

        // Save the Fundraiser to the database
        const savedDonation = await newDonation.save();

        // Populate author details in the donation
        await savedDonation.populate('author', 'name location image');

        // Sending the saved Fundraiser in the response
        res.status(201).json({ success: true, donation: savedDonation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getAllDonations = async (req, res) => {
    try {
        // Fetch all donations from the database
        const donations = await Donation.find().populate('author', 'name location image');

        // Send the donations in the response
        res.status(200).json({ success: true, donations });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
}

const getSingleDonation = async (req, res) => {
    const DonationId = req.params.id;

    try {
        // Fetch the Donation from the database
        const singleDonation = await Donation.findById(DonationId).populate('author', 'name location image');
        if (!singleDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.status(200).json({ success: true, singleDonation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//under consideration
const updateDonation = async (req, res) => {
    const DonationId = req.params.id;
    const { isFavourite } = req.body;

    try {
        // Check if the Donation exists
        const existingDonation = await Donation.findById(DonationId);
        if (!existingDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Update the Donation
        const updatedDonation = await Donation.findByIdAndUpdate(DonationId, { isFavourite }, { new: true });

        // Send success response
        res.status(200).json({ success: true, updatedDonation });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
}

const userDonations = async (req, res) => {
    try {
        console.log(req.user)
        // Fetch all donations from the database that belong to the user
        console.log(req.user._id);
        const donations = await Donation.find({ author: req.user._id }).populate('author', 'name location image');

        // Send the donations in the response
        res.status(200).json({ success: true, donations });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
}



// const deleteDonation = async (req, res) => {
//     const DonationId = req.params.id;

//     try {
//         // Check if the Donation exists
//         const Donation = await Donation.findById(DonationId);
//         if (!Donation) {
//             return res.status(404).json({ message: 'Donation not found' });
//         }

//         // Remove the Donation
//         await Donation.findByIdAndRemove(DonationId);

//         // Send success response
//         res.status(200).json({ message: 'Donation deleted successfully' });
//     } catch (err) {
//         // Handle errors
//         res.status(500).json({ message: err.message });
//     }
// };


// const closeDonation = async (req, res) => {
//     const DonationId = req.params.id;

//     try {
//         // Check if the Donation exists
//         const Donation = await Donation.findById(DonationId);
//         if (!Donation) {
//             return res.status(404).json({ message: 'Donation not found' });
//         }

//         // Update the Donation's isOpen field to false
//         Donation.isOpen = false;
//         await Donation.save();

//         // Send success response
//         res.status(200).json({ message: 'Donation closed successfully' });
//     } catch (err) {
//         // Handle errors
//         res.status(500).json({ message: err.message });
//     }
// };

module.exports = {
    addDonation,
    userDonations,
    getAllDonations,
    getSingleDonation,
    updateDonation,
}