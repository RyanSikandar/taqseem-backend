const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {registerUser, generatePresignedUrl} = require('../controllers/AuthController')
router.post('/register',registerUser)
router.get('/presignedurl', generatePresignedUrl)
module.exports = router;
