const Fundraiser = require("../Models/FundraiserModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const addFundraiser = async (req, res) => {
    const { name, description, category, orgId, isDrive, isLocation, raisedAmount, totalAmount, isOpen } = req.body;

    try {
        // Find the organization by its ID
        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        let imageUrl = '';

        // Use the organization's image if image is not provided
        if (req.file) {
            // Upload image to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, { folder: 'fundraisers' });
            imageUrl = uploadedImage.secure_url;
        } else {
            imageUrl = organization.image;
        }

        // Create the fundraiser
        const fundraiser = new Fundraiser({
            name,
            description,
            category,
            orgId,
            image: imageUrl,
            isDrive,
            isLocation,
            raisedAmount,
            totalAmount,
            isOpen
        });

        // Save the fundraiser to the database
        const savedFundraiser = await fundraiser.save();
        
        // Send the saved fundraiser in the response
        res.status(201).json({success: true, savedFundraiser});
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};

const deleteFundraiser = async (req, res) => {
    const fundraiserId = req.params.id;

    try {
        // Check if the fundraiser exists
        const fundraiser = await Fundraiser.findById(fundraiserId);
        if (!fundraiser) {
            return res.status(404).json({ message: 'Fundraiser not found' });
        }

        // Remove the fundraiser
        await Fundraiser.findByIdAndRemove(fundraiserId);
        
        // Send success response
        res.status(200).json({ message: 'Fundraiser deleted successfully' });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};


const closeFundraiser = async (req, res) => {
    const fundraiserId = req.params.id;

    try {
        // Check if the fundraiser exists
        const fundraiser = await Fundraiser.findById(fundraiserId);
        if (!fundraiser) {
            return res.status(404).json({ message: 'Fundraiser not found' });
        }

        // Update the fundraiser's isOpen field to false
        fundraiser.isOpen = false;
        await fundraiser.save();
        
        // Send success response
        res.status(200).json({ message: 'Fundraiser closed successfully' });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addFundraiser,
    deleteFundraiser,
    closeFundraiser
}