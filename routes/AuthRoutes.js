const router = require('express').Router();
const { registerUser, generatePresignedUrl, getUser, loginStatus, loginUser, logoutUser } = require('../controllers/AuthController');
const protect = require('../middleware/AuthMiddleware');
router.post('/register', registerUser)
router.get('/presignedurl', protect, generatePresignedUrl);
router.get('/user', protect, getUser)
router.get('/loginstatus', loginStatus)
router.post('/login', loginUser)
router.get('/logout', protect, logoutUser)

module.exports = router;
