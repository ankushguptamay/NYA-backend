const express = require("express");
const router = express.Router();

const { register, login, changePassword, getInstitute, updateInstitute } = require('../Controllers/User/instituteController');
const { createEvent, getEventForCreater, getEventById } = require('../Controllers/User/eventController');


//middleware
const { verifyInstituteToken } = require('../Middlewares/varifyToken');
const { isInstitute } = require('../Middlewares/isPresent');
const uploadImage = require('../Middlewares/UploadFile/uploadImages');

// User
router.post("/register", register);
router.post("/login", login);
router.post("/changePassword", verifyInstituteToken, changePassword);
router.get("/institute", verifyInstituteToken, getInstitute);
router.put("/updateInstitute", verifyInstituteToken, updateInstitute);

// Event
router.post("/createEvent", verifyInstituteToken, isInstitute, uploadImage.single("eventImage"), createEvent);
router.get("/events", verifyInstituteToken, isInstitute, getEventForCreater);
router.get("/events/:id", verifyInstituteToken, isInstitute, getEventById);

module.exports = router;