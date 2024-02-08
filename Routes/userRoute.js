const express = require("express");
const router = express.Router();

const { register, login, changePassword, getUser, sendOTPForForgetPassword, verifyOTP, generatePassword } = require('../Controllers/User/userController');
const { getEventForUser, getEventById } = require('../Controllers/User/eventController');
const { bookEvent, myEventForUser } = require('../Controllers/User/event_userController');
const { getQuizForUser, getQuizById } = require('../Controllers/User/quizController');
const { getAasanaForUser, getAasanaBySubCategoryId } = require('../Controllers/Admin/aasanaController');
const { getCategoryForUser } = require('../Controllers/Admin/categoryController');
const { getSubCategoryForUser, getSubCategoryForUserByCategoryId } = require('../Controllers/Admin/subCategoryController');
const { getCelebrity } = require('../Controllers/Admin/celebrityController');

//middleware
const { verifyUserToken } = require('../Middlewares/varifyToken');
const { isUser } = require('../Middlewares/isPresent');

// User
router.post("/register", register);
router.post("/login", login);
router.post("/changePassword", verifyUserToken, changePassword);
router.get("/user", verifyUserToken, getUser);
router.post("/sendOTP", sendOTPForForgetPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/generatePassword", generatePassword);

// Event
router.get("/events", getEventForUser);
router.get("/events/:id", verifyUserToken, isUser, getEventById);
router.post("/bookEvent/:id", verifyUserToken, isUser, bookEvent); // id = event's id
router.get("/myEvent/:id", verifyUserToken, isUser, myEventForUser);

// Quiz
router.get("/quizs", getQuizForUser);
router.get("/quizs/:id", verifyUserToken, isUser, getQuizById);

// Aasana
router.get("/aasanas", getAasanaForUser);
router.get("/aasanas/:subCategoryId", getAasanaBySubCategoryId);
// Category
router.get("/categories", getCategoryForUser);
// SubCategory
router.get("/subCategories", getSubCategoryForUser);
router.get("/subCategories/:categoryId", getSubCategoryForUserByCategoryId);

// Celebrity
router.get("/celebrities", verifyUserToken, isUser, getCelebrity);

module.exports = router;