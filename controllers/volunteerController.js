const Volunteer = require("../models/VolunteerModel");

const getAllVolunteers = async (req, res) => {
  try {
    // Fetch all volunteers from the database
    const volunteers = await Volunteer.find()
      .select("-__v")
      .populate("author", "name location image");
    // Send the volunteers in the response
    res.status(200).json({ success: true, volunteers });
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};

const addVolunteer = async (req, res) => {
  const {
    imageUrls,
    title,
    cause,
    help,
    description,
    currentVolunteers,
    targetVolunteers,
    daysLeft,
    location,
  } = req.body;

  try {
    // Ensure user is authenticated, else cannot add a volunteer
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if all required fields are present
    console.log(req.body);
    if (
      !title ||
      !cause ||
      !help ||
      !description ||
      !targetVolunteers ||
      !daysLeft ||
      !location
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Ensure no duplicate volunteer is created
    const existingVolunteer = await Volunteer.findOne({
      title,
      author: req.user._id,
    });

    if (existingVolunteer) {
      return res
        .status(400)
        .json({ message: "Volunteer Request already exists" });
    }

    // Create the Volunteer
    const newVolunteer = new Volunteer({
      author: req.user._id,
      image:
        imageUrls && imageUrls.length > 0
          ? imageUrls
          : ["/default-fundraiser-image.png"],
      title,
      cause,
      help,
      description,
      currentVolunteers: currentVolunteers || 0,
      targetVolunteers,
      daysLeft,
      location,
      isCompleted: currentVolunteers >= targetVolunteers,
    });

    // Save the volunteer to the database
    const savedVolunteer = await newVolunteer.save();

    // Populate author details in the donation
    await savedVolunteer.populate("author", "name location image");

    // Sending the saved Fundraiser in the response
    res.status(201).json({ success: true, volunteer: savedVolunteer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleVolunteer = async (req, res) => {
  const VolunteerId = req.params.id;

  try {
    // Fetch the Donation from the database
    const singleVolunteer = await Volunteer.findById(VolunteerId).populate(
      "author",
      "name location image"
    );
    if (!singleVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    res.status(200).json({ success: true, singleVolunteer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllVolunteers,
  getSingleVolunteer,
  addVolunteer,
};
