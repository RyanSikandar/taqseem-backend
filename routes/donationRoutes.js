const { getDonationContributions, verifyContribution } = require('../controllers/contributionController');
const { addDonation, getAllDonations, getSingleDonation, updateDonation, userDonations } = require('../controllers/donationController');
const protect = require('../middleware/authMiddleware');

const router = require('express').Router();


// Verify contribution
router.patch('/contribution/verify', protect, verifyContribution);

// add a donation
router.post('/', protect, addDonation);

//get donation with contributions
router.get('/:id/contributions', protect, getDonationContributions);

//get all donations
router.get('/', getAllDonations);

//get user donations
router.get('/user-donations', protect, userDonations);

//get single donation
router.get('/:id', getSingleDonation);

//update a donation (change favs)
router.patch('/:id', updateDonation);




// delete
// router.delete('/:id', deleteFundraiser);
// // complete
// router.patch('/:id', closeFundraiser);


module.exports = router;
