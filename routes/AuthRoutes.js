const router = require('express').Router();
const { registerUser, generatePresignedUrl, getUser, loginStatus, loginUser, logoutUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
router.post('/register', registerUser)
router.get('/presignedurl', generatePresignedUrl);
router.get('/user', protect, getUser)
router.get('/loginstatus', loginStatus)
router.post('/login', loginUser)
router.get('/logout', protect, logoutUser)

module.exports = router;
