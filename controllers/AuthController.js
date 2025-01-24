// Import any necessary modules or dependencies
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const becrypt = require('bcryptjs')
const crypto = require('crypto')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    // validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please provide all fields")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be atleast 6 characters")
    }
    // Check if user email already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }
    // Create a new user
    const newUser = await User.create({
        name,
        email,
        password
    })
    //Genearate the token for the user
    const token = generateToken(newUser._id)

    //Send http only cookie 
    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000), sameSite: "none", secure: true })
    //same site means front end and backend are on different domains
    //secure means it is only sent over https

    // Check if the user was successfully created
    if (newUser) {
        const { _id, name, email, photo, phoneNumber, bio } = newUser
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phoneNumber,
            bio,
            token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
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

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        const { name, email, photo, phoneNumber, bio } = user
        user.email = email
        user.name = req.body.name || name
        user.photo = req.body.photo || photo
        user.phoneNumber = req.body.phoneNumber || phoneNumber
        user.bio = req.body.bio || bio
        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phoneNumber: updatedUser.phoneNumber,
            bio: updatedUser.bio
        })
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})


// Export your controller functions
module.exports = {
    registerUser,
    resetPassword,
    loginUser,
    logoutUser, getUser, loginStatus, updateUser, changePassword, forgotPassword
};
