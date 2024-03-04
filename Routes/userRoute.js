const express = require("express");
const router = express.Router();

const { registerByPassword, loginByPassword, changePassword, getUser, sendOTPForgetPassword, verifyOTPForPassword, generatePassword,
    registerByMobile, loginByMobile, otpVerificationByMobile } = require('../Controllers/User/userController');
const { getEventForUser, getEventById } = require('../Controllers/User/eventController');
const { bookEvent, myEventForUser } = require('../Controllers/User/event_userController');
const { getQuizForUser, getQuizById } = require('../Controllers/User/quizController');
const { getAasanaForUser, getAasanaBySubCategoryId, getAasanaByCategoryId } = require('../Controllers/Admin/aasanaController');
const { getCategoryForUser } = require('../Controllers/Admin/categoryController');
const { getSubCategoryForUser, getSubCategoryForUserByCategoryId } = require('../Controllers/Admin/subCategoryController');
const { getCelebrity } = require('../Controllers/Admin/celebrityController');
const { submitQuizAnswer, myQuizResult } = require('../Controllers/User/quiz_userAnswerController');

//middleware
const { verifyUserToken } = require('../Middlewares/varifyToken');
const { isUser } = require('../Middlewares/isPresent');

// User
router.post("/registerByPassword", registerByPassword);
router.post("/loginByPassword", loginByPassword);
router.post("/sendOTPPassword", sendOTPForgetPassword);
router.post("/verifyOTPPassword", verifyOTPForPassword);
router.post("/generateNewPassword", generatePassword);
router.post("/changePassword", verifyUserToken, changePassword);
router.post("/registerByMobile", registerByMobile);
router.post("/loginByMobile", loginByMobile);
router.post("/otpVerificationByMobile", otpVerificationByMobile);
router.get("/user", verifyUserToken, getUser);

// Event
router.get("/events", getEventForUser);
router.get("/events/:id", verifyUserToken, isUser, getEventById);
router.post("/bookEvent/:id", verifyUserToken, isUser, bookEvent); // id = event's id
router.get("/myEvent/:id", verifyUserToken, isUser, myEventForUser);

// Quiz
router.get("/quizs", getQuizForUser);
router.get("/quizs/:id", verifyUserToken, isUser, getQuizById);

// Quiz Answer
router.post("/submitAnswer", verifyUserToken, isUser, submitQuizAnswer);
router.get("/quizResult", verifyUserToken, isUser, myQuizResult);

// Aasana
router.get("/aasanas", getAasanaForUser);
router.get("/aasanas/:subCategoryId", getAasanaBySubCategoryId);
router.get("/aasanas/:categoryId", getAasanaByCategoryId);
// Category
router.get("/categories", getCategoryForUser);
// SubCategory
router.get("/subCategories", getSubCategoryForUser);
router.get("/subCategories/:categoryId", getSubCategoryForUserByCategoryId);

// Celebrity
router.get("/celebrities", getCelebrity);

module.exports = router;