const express = require("express");
const router = express.Router();

const { register, login, changePassword, getInstructor } = require('../Controllers/User/instructorController');

//middleware
const { verifyInstructorToken } = require('../Middlewares/varifyToken');
const { isInstructor } = require('../Middlewares/isPresent');

// User
router.post("/register", register);
router.post("/login", login);
router.post("/changePassword", verifyInstructorToken, changePassword);
router.get("/instructor", verifyInstructorToken, getInstructor);

module.exports = router;