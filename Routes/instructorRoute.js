const express = require("express");
const router = express.Router();

const { register, login, changePassword, getInstructor, updateInstructor } = require('../Controllers/User/instructorController');
const { createEvent, getEventForCreater, getEventById, updateEvent } = require('../Controllers/User/eventController');
const { eventBookByUser } = require('../Controllers/User/event_userController');
const { createQuiz, getQuizForCreater, getQuizById } = require('../Controllers/User/quizController');
const { getAasanaForUser } = require('../Controllers/Admin/aasanaController');
const { getCategoryForUser } = require('../Controllers/Admin/categoryController');
const { getSubCategoryForUser } = require('../Controllers/Admin/subCategoryController');

//middleware
const { verifyInstructorToken } = require('../Middlewares/varifyToken');
const { isInstructor } = require('../Middlewares/isPresent');
const uploadImage = require('../Middlewares/UploadFile/uploadImages');

// User
router.post("/register", register);
router.post("/login", login);
router.post("/changePassword", verifyInstructorToken, changePassword);
router.get("/instructor", verifyInstructorToken, getInstructor);
router.put("/updateInstructor", verifyInstructorToken, updateInstructor);

// Event
router.post("/createEvent", verifyInstructorToken, isInstructor, uploadImage.single("eventImage"), createEvent);
router.get("/events", verifyInstructorToken, isInstructor, getEventForCreater);
router.get("/events/:id", verifyInstructorToken, isInstructor, getEventById);
router.put("/updateEvent/:id", verifyInstructorToken, isInstructor, uploadImage.single("eventImage"), updateEvent);
router.get("/eventUsers/:id", verifyInstructorToken, isInstructor, eventBookByUser);

// Quiz
router.post("/createQuiz", verifyInstructorToken, isInstructor, uploadImage.single("quizImage"), createQuiz);
router.get("/quizs", verifyInstructorToken, isInstructor, getQuizForCreater);
router.get("/quizs/:id", verifyInstructorToken, isInstructor, getQuizById);

// Aasana
router.get("/aasanas", verifyInstructorToken, isInstructor, getAasanaForUser);
// Category
router.get("/categories", verifyInstructorToken, isInstructor, getCategoryForUser);
// SubCategory
router.get("/subCategories", verifyInstructorToken, isInstructor, getSubCategoryForUser);

module.exports = router;