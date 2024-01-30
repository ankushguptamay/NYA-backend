const express = require("express");
const router = express.Router();

const { register, login, changePassword, getInstitute, updateInstitute } = require('../Controllers/User/instituteController');
const { createEvent, getEventForCreater, getEventById, updateEvent } = require('../Controllers/User/eventController');
const { createQuiz, getQuizForCreater, getQuizById } = require('../Controllers/User/quizController');
const { eventBookByUser } = require('../Controllers/User/event_userController');
const { getAasanaForUser, getAasanaBySubCategoryId } = require('../Controllers/Admin/aasanaController');
const { getCategoryForUser } = require('../Controllers/Admin/categoryController');
const { getSubCategoryForUser, getSubCategoryForUserByCategoryId } = require('../Controllers/Admin/subCategoryController');

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
router.put("/updateEvent/:id", verifyInstituteToken, isInstitute, uploadImage.single("eventImage"), updateEvent);
router.get("/eventUsers/:id", verifyInstituteToken, isInstitute, eventBookByUser);

// Quiz
router.post("/createQuiz", verifyInstituteToken, isInstitute, uploadImage.single("quizImage"), createQuiz);
router.get("/quizs", verifyInstituteToken, isInstitute, getQuizForCreater);
router.get("/quizs/:id", verifyInstituteToken, isInstitute, getQuizById);

// Aasana
router.get("/aasanas", getAasanaForUser);
router.get("/aasanas/:subCategoryId", getAasanaBySubCategoryId);
// Category
router.get("/categories", getCategoryForUser);
// SubCategory
router.get("/subCategories", getSubCategoryForUser);
router.get("/subCategories/:categoryId", getSubCategoryForUserByCategoryId);

module.exports = router;