//Ryan
// Import any necessary modules or dependencies
const asyncHandler = require('express-async-handler')
const Organization = require('../Models/OrganizationModel')
const jwt = require('jsonwebtoken')
const becrypt = require('bcryptjs')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2
const {formatBytes} = require('../utils/fileUpload')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const registerOrganization = asyncHandler(async (req, res) => {
    const { name, address, location, phoneNo, email, password, isOrganization,
        isValidated
    } = req.body

    //Validating

    if (!name || !address || !location || !phoneNo || !email || !password || !isOrganization || !isValidated) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    //Checking if organization already exists
    const organizationExists = await Organization.findOne({ email });
    if (organizationExists) {
        res.status(400)
        throw new Error('Organization already exists')
    }

    //Check if image is uploaded
    let imageData = {};
    if (req.file) {
        let uploadedImage;
        try {
            uploadedImage = await cloudinary.uploader.upload(req.file.path, { folder: 'organizations' })
        } catch (error) {
            res.status(500)
            throw new Error('Image upload failed')
        }
        imageData = {
            fileName: req.file.originalname,
            filePath: uploadedImage.secure_url,
            fileType: req.file.mimetype,
            fileSize: formatBytes(req.file.size)

        }
    }

    const organization = await Organization.create({
        name,
        address,
        location,
        phoneNo,
        email,
        isOrganization,
        isValidated,
        image: imageData
    })

    if (organization) {
        res.status(201).json({
            _id: organization._id,
            name: organization.name,
            address: organization.address,
            location: organization.location,
            phoneNo: organization.phoneNo,
            email: organization.email,
            isOrganization: organization.isOrganization,
            isValidated: organization.isValidated,
            image: organization.image,
            password: organization.password
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid organization data')
    }

})

module.exports = {
    registerOrganization,
}