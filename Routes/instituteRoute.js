const express = require("express");
const router = express.Router();

const { registerInstitutePassword, loginByPassword, changePassword, getInstitute, updateInstitute, sendOTPForForgetPassword, verifyOTPForPassword, generatePassword } = require('../Controllers/User/instituteController');
const { createEvent, getEventForCreater, getEventById, updateEvent } = require('../Controllers/User/eventController');
const { createQuiz, getQuizForCreater, getQuizById, updateQuiz } = require('../Controllers/User/quizController');
const { eventBookByUser } = require('../Controllers/User/event_userController');
const { getAasanaForUser, getAasanaBySubCategoryId } = require('../Controllers/Admin/aasanaController');
const { getCategoryForUser } = require('../Controllers/Admin/categoryController');
const { getSubCategoryForUser, getSubCategoryForUserByCategoryId } = require('../Controllers/Admin/subCategoryController');
const { getCelebrity } = require('../Controllers/Admin/celebrityController');

//middleware
const { verifyInstituteToken } = require('../Middlewares/varifyToken');
const { isInstitute } = require('../Middlewares/isPresent');
const uploadImage = require('../Middlewares/UploadFile/uploadImages');

// User
router.post("/registerPassword", registerInstitutePassword);
router.post("/loginByPassword", loginByPassword);
router.post("/changePassword", verifyInstituteToken, changePassword);
router.post("/sendOTPPassword", sendOTPForForgetPassword);
router.post("/verifyOTPPassword", verifyOTPForPassword);
router.post("/generatePassword", generatePassword);
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
router.put("/updateQuiz/:id", verifyInstituteToken, isInstitute, uploadImage.single("quizImage"), updateQuiz);

// Aasana
router.get("/aasanas", getAasanaForUser);
router.get("/aasanas/:subCategoryId", getAasanaBySubCategoryId);
// Category
router.get("/categories", getCategoryForUser);
// SubCategory
router.get("/subCategories", getSubCategoryForUser);
router.get("/subCategories/:categoryId", getSubCategoryForUserByCategoryId);

// Celebrity
router.get("/celebrities", verifyInstituteToken, isInstitute, getCelebrity);

module.exports = router;