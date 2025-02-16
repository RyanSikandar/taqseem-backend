const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const roleProtection = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401)
            throw new Error("Not authorized, please login")
        }

        //Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //Get admin property from token
        const isAdmin = verified.admin
        console.log("is user admin", isAdmin)
        if (!isAdmin) {
            res.status(401).json({ message: "Unauthorized" })
        }

        next()
    }
    catch (e) {
        res.status(404)
        throw new Error("User not found")
    }
})

module.exports = roleProtection;
