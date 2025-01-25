const { addDonation, getAllDonations } = require('../controllers/donationController');
const protect = require('../middleware/AuthMiddleware');

const router = require('express').Router();

// add a donation
router.post('/', protect, addDonation);

//get all donations
router.get('/', getAllDonations);
// delete
// router.delete('/:id', deleteFundraiser);
// // complete
// router.patch('/:id', closeFundraiser);


module.exports = router;
