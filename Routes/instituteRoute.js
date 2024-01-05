const express = require("express");
const router = express.Router();

const { register, login, changePassword, getInstitute, updateInstitute } = require('../Controllers/User/instituteController');


//middleware
const { verifyInstituteToken } = require('../Middlewares/varifyToken');
const { isInstitute } = require('../Middlewares/isPresent');

// User
router.post("/register", register);
router.post("/login", login);
router.post("/changePassword", verifyInstituteToken, changePassword);
router.get("/institute", verifyInstituteToken, getInstitute);
router.put("/updateInstitute", verifyInstituteToken, updateInstitute);

module.exports = router;