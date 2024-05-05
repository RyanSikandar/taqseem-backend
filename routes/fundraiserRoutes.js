const { addFundraiser, deleteFundraiser, closeFundraiser } = require('../controllers/fundraiserController');

const router = require('express').Router();

// add
router.post('/', addFundraiser);
// delete
router.delete('/:id', deleteFundraiser);
// complete
router.patch('/:id', closeFundraiser);


module.exports = router;
