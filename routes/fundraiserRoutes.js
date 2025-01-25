const { addDonation, deleteFundraiser, closeFundraiser } = require('../controllers/donationController');
const protect = require('../middleware/AuthMiddleware');

const router = require('express').Router();

// add
router.post('/', protect, addDonation);
// delete
// router.delete('/:id', deleteFundraiser);
// // complete
// router.patch('/:id', closeFundraiser);


module.exports = router;
