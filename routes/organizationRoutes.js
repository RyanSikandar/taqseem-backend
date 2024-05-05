const express = require('express');
const protect = require('../middleware/authMiddleware')
const router = express.Router();
const { registerOrganization } = require('../controllers/authController')
const {upload} = require('../utils/fileUpload')
// Define your user routes here
router.post("/register", upload.single("image"),registerOrganization);
// router.post("/login", loginUser);
// router.get("/logout", logoutUser)
// router.get("/getuser", protect, getUser)
// router.get("/loggedin", loginStatus)
// router.patch("/updateUser", protect, updateUser) //only logged in users can update their info
// router.patch("/changePassword", protect, changePassword) //only logged in users can update their password
// router.post("/forgotpassword", forgotPassword) //logged out users can request a password reset and also it is a post method because we are sending an email
// router.put("/resetpassword/:resetToken", resetPassword)

module.exports = router;