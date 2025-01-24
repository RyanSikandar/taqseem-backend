// Import any necessary modules or dependencies
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {

    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, description, email, location, password, cnic } = req.body;

    // Validation
    if (!name || !email || !password || !description || !location || !req.file || !cnic) {
        res.status(400);
        throw new Error('Please provide all fields');
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

    // Ensure the file exists and is of the correct type
    const file = req.file;
    if (!file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        res.status(400);
        throw new Error('Only JPEG and PNG images are allowed');
    }

    // Upload image to S3
    const key = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
    const params = {
        Bucket: 'ryan-taqseem',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Optional: makes the file publicly accessible
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(params));
        console.log('File uploaded successfully:', data);
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500);
        throw new Error('Error uploading image to S3');
    }

    // Create new user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        description,
        location,
        image: key, // Store the S3 file key in the user's profile
    });

    // Generate the token for the user
    const token = generateToken(newUser._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: 'none',
        secure: true,
    });

    // Check if the user was successfully created
    if (newUser) {
        const { _id, name, email, description } = newUser;
        res.status(201).json({
            _id,
            name,
            email,
            image: key, // Return the image key
            description,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // Validation request
    if (!email || !password) {
        res.status(400)
        throw new Error("Please provide email and password")
    }
    //Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
        res.status(401)
        throw new Error("Invalid credentials, user does not exist")
    }
    //User exists, Check if password matches
    const isMatch = await becrypt.compare(password, user.password)
    //Genearate the token for the user
    const token = generateToken(user._id)

    //Send http only cookie 
    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000), sameSite: "none", secure: true })
    //same site means front end and backend are on different domains
    //secure means it is only sent over https

    if (user && isMatch) {
        const { _id, name, email, photo, phoneNumber, bio } = user
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phoneNumber,
            bio,
            token
        })
    }
    else {
        res.status(401)
        throw new Error("Invalid credentials.")

    }

    if (!isMatch) {
        res.status(401)
        throw new Error("Invalid credentials, password does not match")
    }
})
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0), sameSite: "none", secure: true })
    return res.status(200).json({ message: "User succesfully logged out." })
})

//to get current user info 
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    if (user) {
        const { _id, name, email, photo, phoneNumber, bio } = user
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phoneNumber,
            bio
        })
    }
    else {
        res.status(401)
        throw new Error("User not found.")

    }
})

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        res.json(false)
    }
    //Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
        return res.json(true)
    }
    res.send("User is logged in")
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser, getUser, loginStatus
};
