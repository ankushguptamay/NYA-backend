const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin, sendOTPForForgetPassword, verifyOTP, generatePassword, changePassword } = require('../Controllers/Admin/authAdminController');
const { createAasana, getAasanaForAdmin, unPublicAasana, updateAasana, publicAasana, hardDeleteAasana } = require('../Controllers/Admin/aasanaController');
const { createCategory, getCategory, unPublishCategory, publishCategory, updateCategory } = require('../Controllers/Admin/categoryController');
const { getAllUser } = require('../Controllers/User/userController');
const { createSubCategory, getSubCategoryForAdmin, publicSubCategory, updateSubCategory, unPublicSubCategory } = require('../Controllers/Admin/subCategoryController');
const { getAllInstitute, approveInstituteRegistration, disApproveInstituteRegistration, getAllInstituteUpdation, approveInstituteUpdate, disApproveInstituteUpdate } = require('../Controllers/User/instituteController');
const { getAllInstructor, approveInstructorRegistration, disApproveInstructorRegistration, getAllInstructorUpdation, disApproveInstructorUpdation, approveInstructorUpdation } = require('../Controllers/User/instructorController');
const { getEventForAdmin, approveEventCreation, disApproveEventCreation, getEventById, approveEventUpdation, disApproveEventUpdation, getEventUpdationForAdmin } = require('../Controllers/User/eventController');
const { eventBookByUser } = require('../Controllers/User/event_userController');
const { getQuizForAdmin, approveQuizCreation, disApproveQuizCreation, getQuizById, getQuizUpdationForAdmin, approveQuizUpdation, disApproveQuizUpdation } = require('../Controllers/User/quizController');
const { createCelebrity, getCelebrity, updateCelebrity, deleteCelebrity } = require('../Controllers/Admin/celebrityController');

//middleware
const { verifyAdminToken } = require('../Middlewares/varifyToken');
const { isAdmin } = require('../Middlewares/isPresent');
const uploadImage = require('../Middlewares/UploadFile/uploadImages');


// Admin
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/sendOTP", sendOTPForForgetPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/generatePassword", generatePassword);
router.post("/changePassword", verifyAdminToken, changePassword);

// Category
router.post("/createCategory", verifyAdminToken, isAdmin, uploadImage.single("categoryImage"), createCategory);
router.get("/getCategory", verifyAdminToken, isAdmin, getCategory);
router.put("/unPublishCategory/:id", verifyAdminToken, isAdmin, unPublishCategory);
router.put("/publishCategory/:id", verifyAdminToken, isAdmin, publishCategory);
router.put("/updateCategory/:id", verifyAdminToken, isAdmin, uploadImage.single("categoryImage"), updateCategory);
//SubCategory
router.post("/createSubCategory", verifyAdminToken, isAdmin, uploadImage.single("subCategoryImage"), createSubCategory);
router.get("/getSubCategory", verifyAdminToken, isAdmin, getSubCategoryForAdmin);
router.put("/publishSubCategory/:id", verifyAdminToken, isAdmin, publicSubCategory);
router.put("/unPublishSubCategory/:id", verifyAdminToken, isAdmin, unPublicSubCategory);
router.put("/updateSubCategory/:id", verifyAdminToken, isAdmin, uploadImage.single("subCategoryImage"), updateSubCategory);
// Aasana
router.post("/createAasana", verifyAdminToken, isAdmin, createAasana);
router.get("/getAasana", verifyAdminToken, isAdmin, getAasanaForAdmin);
router.put("/unPublishAasana/:id", verifyAdminToken, isAdmin, unPublicAasana);
router.put("/publishAasana/:id", verifyAdminToken, isAdmin, publicAasana);
router.put("/updateAasana/:id", verifyAdminToken, isAdmin, updateAasana);
router.delete("/hardDeleteAasana/:id", verifyAdminToken, isAdmin, hardDeleteAasana);

// User
router.get("/users", verifyAdminToken, isAdmin, getAllUser);

// Institute
router.get("/institutes", verifyAdminToken, isAdmin, getAllInstitute);
router.put("/approveInstituteRegistration/:id", verifyAdminToken, isAdmin, approveInstituteRegistration);
router.put("/disApproveInstituteRegistration/:id", verifyAdminToken, isAdmin, disApproveInstituteRegistration);
router.get("/institutesUpdation", verifyAdminToken, isAdmin, getAllInstituteUpdation);
router.put("/approveInstituteUpdate/:id", verifyAdminToken, isAdmin, approveInstituteUpdate);
router.put("/disApproveInstituteUpdate/:id", verifyAdminToken, isAdmin, disApproveInstituteUpdate);

// Instructor
router.get("/instructors", verifyAdminToken, isAdmin, getAllInstructor);
router.put("/approveInstructorRegistration/:id", verifyAdminToken, isAdmin, approveInstructorRegistration);
router.put("/disApproveInstructorRegistration/:id", verifyAdminToken, isAdmin, disApproveInstructorRegistration);
router.get("/instructorsUpdation", verifyAdminToken, isAdmin, getAllInstructorUpdation);
router.put("/approveInstructorUpdation/:id", verifyAdminToken, isAdmin, approveInstructorUpdation);
router.put("/disApproveInstructorUpdation/:id", verifyAdminToken, isAdmin, disApproveInstructorUpdation);

// Event
router.get("/events", verifyAdminToken, isAdmin, getEventForAdmin);
router.get("/getEventUpdation", verifyAdminToken, isAdmin, getEventUpdationForAdmin);
router.get("/events/:id", verifyAdminToken, isAdmin, getEventById);
router.put("/approveEventCreation/:id", verifyAdminToken, isAdmin, approveEventCreation);
router.put("/disApproveEventCreation/:id", verifyAdminToken, isAdmin, disApproveEventCreation);
router.put("/approveEventUpdation/:id", verifyAdminToken, isAdmin, approveEventUpdation);
router.put("/disApproveEventUpdation/:id", verifyAdminToken, isAdmin, disApproveEventUpdation);
router.get("/eventUsers/:id", verifyAdminToken, isAdmin, eventBookByUser); // id = event's id

// Quiz
router.get("/quizs", verifyAdminToken, isAdmin, getQuizForAdmin);
router.get("/quizs/:id", verifyAdminToken, isAdmin, getQuizById);
router.put("/approveQuizCreation/:id", verifyAdminToken, isAdmin, approveQuizCreation);
router.put("/disApproveQuizCreation/:id", verifyAdminToken, isAdmin, disApproveQuizCreation);
router.put("/approveQuizUpdation/:id", verifyAdminToken, isAdmin, approveQuizUpdation);
router.put("/disApproveQuizUpdation/:id", verifyAdminToken, isAdmin, disApproveQuizUpdation);
router.get("/getQuizUpdation", verifyAdminToken, isAdmin, getQuizUpdationForAdmin);

// Celebrity
router.post("/createCelebrity", verifyAdminToken, isAdmin, createCelebrity);
router.get("/celebrities", verifyAdminToken, isAdmin, getCelebrity);
router.put("/updateCelebrity/:id", verifyAdminToken, isAdmin, updateCelebrity);
router.delete("/deleteCelebrity/:id", verifyAdminToken, isAdmin, deleteCelebrity);

module.exports = router;