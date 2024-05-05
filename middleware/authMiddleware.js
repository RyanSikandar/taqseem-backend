const asyncHandler = require("express-async-handler");
const Organization = require("../Models/OrganizationModel");
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
        console.log(verified)
        const organization = await Organization.findById(verified.organizationId).select("-password")
        if (!organization) {
            res.status(404)
            throw new Error("Organization not found")
        }
        req.organization = organization
        next()
    }
    catch (e) {
        res.status(404)
        throw new Error(e.message)
    }
})

module.exports = protect;