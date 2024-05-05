const { getAllAdminBlogs, createAdminBlog, removeAdminBlog } = require('../controllers/adminBlogController');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = require('express').Router();

router.get('/', getAllAdminBlogs);
router.post('/', upload.single("image"), createAdminBlog);
router.delete('/:id', removeAdminBlog);

module.exports = router;
