const { getAllVolunteers, addVolunteer, getSingleVolunteer } = require('../controllers/volunteerController');
const protect = require('../middleware/authMiddleware');

const router = require('express').Router();

// add a volunteer
router.post('/add-volunteer', protect, addVolunteer);

//get all volunteers
router.get('/', getAllVolunteers);

//get single volunteer
router.get('/get-volunteer/:id', getSingleVolunteer);

module.exports = router;
