const express = require("express");
const router = express.Router();

const { register, login, changePassword, getUser } = require('../Controllers/User/userController');
const { getEventForUser, getEventById } = require('../Controllers/User/eventController');
const { bookEvent, myEventForUser } = require('../Controllers/User/event_userController');

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
router.post("/bookEvent/:id", verifyUserToken, isUser, bookEvent); // id = event's id
router.get("/myEvent/:id", verifyUserToken, isUser, myEventForUser);

module.exports = router;