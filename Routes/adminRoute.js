const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin } = require('../Controllers/Admin/authAdminController');
const { createAasana, getAasanaForAdmin, unPublicAasana, updateAasana, publicAasana, hardDeleteAasana } = require('../Controllers/Admin/aasanaController');
const { createCategory, getCategory, unPublicCategory, publicCategory, updateCategory } = require('../Controllers/Admin/categoryController');
const { getAllUser } = require('../Controllers/User/userController');
const { createSubCategory, getSubCategoryForAdmin, publicSubCategory, updateSubCategory, unPublicSubCategory } = require('../Controllers/Admin/subCategoryController');
const { getAllInstitute, approveInstitute, disApproveInstitute } = require('../Controllers/User/instituteController');
const { getAllInstructor, approveInstructor, disApproveInstructor } = require('../Controllers/User/instructorController');

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
router.put("/approveInstitute/:id", verifyAdminToken, isAdmin, approveInstitute);
router.put("/disApproveInstitute/:id", verifyAdminToken, isAdmin, disApproveInstitute);

// Instructor
router.get("/instructors", verifyAdminToken, isAdmin, getAllInstructor);
router.put("/approveInstructor/:id", verifyAdminToken, isAdmin, approveInstructor);
router.put("/disApproveInstructor/:id", verifyAdminToken, isAdmin, disApproveInstructor);

module.exports = router;