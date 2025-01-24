const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {registerUser} = require('../controllers/AuthController')
router.post('/register', upload.single("image"), registerUser)

module.exports = router;
