const express = require("express");
const router = express.Router();

const { register, login, changePassword, getInstructor, updateInstructor, sendOTPForForgetPassword, verifyOTP, generatePassword } = require('../Controllers/User/instructorController');
const { createEvent, getEventForCreater, getEventById, updateEvent } = require('../Controllers/User/eventController');
const { eventBookByUser } = require('../Controllers/User/event_userController');
const { createQuiz, getQuizForCreater, getQuizById, updateQuiz } = require('../Controllers/User/quizController');
const { getAasanaForUser, getAasanaBySubCategoryId } = require('../Controllers/Admin/aasanaController');
const { getCategoryForUser } = require('../Controllers/Admin/categoryController');
const { getSubCategoryForUser, getSubCategoryForUserByCategoryId } = require('../Controllers/Admin/subCategoryController');
const { getCelebrity } = require('../Controllers/Admin/celebrityController');

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
router.post("/sendOTP", sendOTPForForgetPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/generatePassword", generatePassword);

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
router.put("/updateQuiz/:id", verifyInstructorToken, isInstructor, uploadImage.single("quizImage"), updateQuiz);

// Aasana
router.get("/aasanas", getAasanaForUser);
router.get("/aasanas/:subCategoryId", getAasanaBySubCategoryId);
// Category
router.get("/categories", getCategoryForUser);
// SubCategory
router.get("/subCategories", getSubCategoryForUser);
router.get("/subCategories/:categoryId", getSubCategoryForUserByCategoryId);

// Celebrity
router.get("/celebrities", verifyInstructorToken, isInstructor, getCelebrity);

module.exports = router;