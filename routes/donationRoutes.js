const { addDonation, getAllDonations, getSingleDonation, updateDonation, userDonations } = require('../controllers/donationController');
const protect = require('../middleware/AuthMiddleware');

const router = require('express').Router();

// add a donation
router.post('/', protect, addDonation);

//get all donations
router.get('/', getAllDonations);

//get user donations
router.get('/userDonations', protect, userDonations);

//get single donation
router.get('/:id', getSingleDonation);

//update a donation (change favs)
router.patch('/:id', updateDonation);


// delete
// router.delete('/:id', deleteFundraiser);
// // complete
// router.patch('/:id', closeFundraiser);


module.exports = router;
