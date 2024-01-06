const express = require("express");
const router = express.Router();

const { register, login, changePassword, getUser } = require('../Controllers/User/userController');
const { getEventForUser, getEventById } = require('../Controllers/User/eventController');


//middleware
const { verifyUserToken } = require('../Middlewares/varifyToken');
const { isUser } = require('../Middlewares/isPresent');

// User
router.post("/register", register);
router.post("/login", login);
router.post("/changePassword", verifyUserToken, changePassword);
router.get("/user", verifyUserToken, getUser);

// Event
router.get("/events", verifyUserToken, isUser, getEventForUser);
router.get("/events/:id", verifyUserToken, isUser, getEventById);

module.exports = router;