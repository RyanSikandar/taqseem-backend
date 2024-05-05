const { getAllBookmarks, removeBookmark, addBookmark } = require('../controllers/bookmarkController');

const router = require('express').Router();

router.get('/:donorId', getAllBookmarks);
router.post('/', addBookmark);
router.delete('/:id', removeBookmark);

module.exports = router;
