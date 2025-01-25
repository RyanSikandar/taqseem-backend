const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401)
            throw new Error("Not authorized, please login")
        }

        //Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //Get user id from token
        const user = await User.findById(verified.id).select("-password")
        if (!user) {
            res.status(404)
            throw new Error("User not found")
        }
        req.user = user
        next()
    }
    catch (e) {
        res.status(404)
        throw new Error("User not found")
    }
})

module.exports = protect;