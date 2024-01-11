const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin } = require('../Controllers/Admin/authAdminController');
const { createAasana, getAasanaForAdmin, unPublicAasana, updateAasana, publicAasana, hardDeleteAasana } = require('../Controllers/Admin/aasanaController');
const { createCategory, getCategory, unPublicCategory, publicCategory, updateCategory } = require('../Controllers/Admin/categoryController');
const { getAllUser } = require('../Controllers/User/userController');
const { createSubCategory, getSubCategoryForAdmin, publicSubCategory, updateSubCategory, unPublicSubCategory } = require('../Controllers/Admin/subCategoryController');
const { getAllInstitute, approveInstituteRegistration, disApproveInstituteRegistration, getAllInstituteUpdation, approveInstituteUpdate, disApproveInstituteUpdate } = require('../Controllers/User/instituteController');
const { getAllInstructor, approveInstructorRegistration, disApproveInstructorRegistration, getAllInstructorUpdation, disApproveInstructorUpdation, approveInstructorUpdation } = require('../Controllers/User/instructorController');
const { getEventForAdmin, approveEventCreation, disApproveEventCreation, getEventById, approveEventUpdation, disApproveEventUpdation, getEventUpdationForAdmin } = require('../Controllers/User/eventController');
const { eventBookByUser } = require('../Controllers/User/event_userController');
const { getQuizForAdmin, approveQuizCreation, disApproveQuizCreation, getQuizById } = require('../Controllers/User/quizController');

//middleware
const { verifyAdminToken } = require('../Middlewares/varifyToken');
const { isAdmin } = require('../Middlewares/isPresent');
const uploadImage = require('../Middlewares/UploadFile/uploadImages');


// Admin
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
// Category
router.post("/createCategory", verifyAdminToken, isAdmin, uploadImage.single("categoryImage"), createCategory);
router.get("/getCategory", verifyAdminToken, isAdmin, getCategory);
router.put("/unPublicCategory/:id", verifyAdminToken, isAdmin, unPublicCategory);
router.put("/publicCategory/:id", verifyAdminToken, isAdmin, publicCategory);
router.put("/updateCategory/:id", verifyAdminToken, isAdmin, uploadImage.single("categoryImage"), updateCategory);
//SubCategory
router.post("/createSubCategory", verifyAdminToken, isAdmin, uploadImage.single("subCategoryImage"), createSubCategory);
router.get("/getSubCategory", verifyAdminToken, isAdmin, getSubCategoryForAdmin);
router.put("/publicSubCategory/:id", verifyAdminToken, isAdmin, publicSubCategory);
router.put("/unPublicSubCategory/:id", verifyAdminToken, isAdmin, unPublicSubCategory);
router.put("/updateSubCategory/:id", verifyAdminToken, isAdmin, uploadImage.single("subCategoryImage"), updateSubCategory);
// Aasana
router.post("/createAasana", verifyAdminToken, isAdmin, createAasana);
router.get("/getAasana", verifyAdminToken, isAdmin, getAasanaForAdmin);
router.put("/unPublicAasana/:id", verifyAdminToken, isAdmin, unPublicAasana);
router.put("/publicAasana/:id", verifyAdminToken, isAdmin, publicAasana);
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

module.exports = router;