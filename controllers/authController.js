// Import any necessary modules or dependencies
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});



const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
};

const generatePresignedUrl = asyncHandler(async (req, res) => {
    const { fileType } = req.query;
    console.log(fileType);

    if (!fileType) {
        res.status(400);
        throw new Error('File type is required');
    }

    try {
        // Generate a unique file key
        const fileKey = `${uuidv4()}.${fileType.split('/')[1]}`;

        // Pre-signed URL parameters
        const params = {
            Bucket: 'ryan-taqseem',
            Key: fileKey,
            ContentType: fileType,
            ACL: 'public-read',
        };

        // Create a pre-signed URL for PUT
        const command = new PutObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1-hour expiration

        res.json({ url, key: fileKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating pre-signed URL' });
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, description, email, location, password, cnic, image } = req.body;

    // Validation
    if (!name || !email || !password || !description || !location || !cnic || !image) {
        res.status(400);
        throw new Error('Please provide all fields, including the image URL');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    // Check if user email already exists
    const userExists = await User.findOne({ email, cnic });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate image URL (Optional: Ensure it’s an S3 URL)
    const s3BucketName = 'ryan-taqseem';
    if (!image.startsWith(`https://${s3BucketName}.s3.amazonaws.com/`)) {
        res.status(400);
        throw new Error('Invalid image URL');
    }

    // Create new user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        description,
        location,
        cnic,
        image: image, //storing the public url in the database
    });

    // Generate the token for the user
    const token = generateToken(newUser._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        secure: true,
    });

    // Check if the user was successfully created
    if (newUser) {
        const { _id, name, email, description } = newUser;
        res.status(201).json({
            _id,
            name,
            email,
            image: image,
            description,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation request
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
           return res.status(404).json({ message: "User not found" });
        }

        // User exists, Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate the token for the user
        const token = generateToken(user._id);
        console.log(token);

        // Set http only cookie before sending the response
        console.log("cookie being set");
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            sameSite: "none",
            secure: true
        });
        if (user) {
            const { _id, name, email, image } = user;
            res.status(200).json({
                _id,
                name,
                email,
                image
            });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};


const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0), sameSite: "lax", secure: true })
    return res.status(200).json({ message: "User succesfully logged out." })
})

//to get current user info 
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    if (user) {
        const { _id, name, email, image, description, cnic,location } = user
        res.status(200).json({
            name,
            email,
            image,
            description,
            cnic,
            location
        })
    }
    else {
        res.status(401)
        throw new Error("User not found.")

    }
})

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        return res.json(verified ? true : false);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});


module.exports = {
    registerUser,
    loginUser,
    logoutUser, getUser, loginStatus, generatePresignedUrl
};
