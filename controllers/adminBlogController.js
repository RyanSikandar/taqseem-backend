const AdminBlog = require("../Models/AdminBlogSchema");
const Organization = require("../Models/OrganizationModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const getAllAdminBlogs = async (req, res) => {
    try {
        const adminBlogs = await AdminBlog.find().sort({ createdAt: -1 }); // Sorting by createdAt field in descending order
        res.status(200).json(adminBlogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createAdminBlog = async (req, res) => {
    const {description, driveId } = req.body;

};

const removeAdminBlog = async (req, res) => {
    const { description, driveId } = req.body;

    try {
        // Find the fundraiser (drive) by its ID
        const fundraiser = await Fundraiser.findById(driveId);
        if (!fundraiser) {
            return res.status(404).json({ message: 'Fundraiser not found' });
        }

        // Create the admin blog with the description and image from the fundraiser
        const adminBlog = new AdminBlog({
            driveId,
            description,
            image: fundraiser.image
        });

        // Save the admin blog to the database
        const savedAdminBlog = await adminBlog.save();
        
        // Send the saved admin blog in the response
        res.status(201).json(savedAdminBlog);
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getAllAdminBlogs,
    createAdminBlog,
    removeAdminBlog
};