const db = require('../../Models');
const User = db.user;
const { loginUser, registerUser, changePassword } = require("../../Middlewares/Validate/validateUser");
const { JWT_SECRET_KEY_USER, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const SALT = 10;

// register
// login
// changePassword
// getUser

// getAllUser

exports.register = async (req, res) => {
    try {
        // Validate Body
        const { error } = registerUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Check in paranoid true
        const isUser = await User.findOne({
            where: {
                email: req.body.email
            },
            paranoid: false
        });
        if (isUser) {
            return res.status(400).send({
                success: false,
                message: "Credentials exist!"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Create user in database
        const user = await User.create({
            email: req.body.email,
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            password: hashedPassword
        });
        // generate JWT Token
        const authToken = jwt.sign(
            {
                id: user.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Registered successfully!',
            authToken: authToken
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        // Validate Body
        const { error } = loginUser(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        // If Email is already present
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Compare password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // generate JWT Token
        const authToken = jwt.sign(
            {
                id: user.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Loged in successfully!',
            authToken: authToken,
            name: user.name
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        // Validate Body
        const { error } = changePassword(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        const user = await User.findOne({
            where: {
                email: req.user.email
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Compare current password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.oldPassword,
            user.password
        );
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                message: "Invalid password!"
            });
        }
        // Generate hash password of newPassword
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        await user.update({
            ...user,
            password: hashedPassword
        });
        // Generate JWT Token
        const authToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Password changed successfully!',
            authToken: authToken
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.user.email, id: req.user.id
            },
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User is not present!"
            });
        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: "User Profile Fetched successfully!",
            data: user
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const { page, search } = req.query;
        // Pagination
        const limit = req.query.limit || 10;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        // Search 
        const condition = [];
        if (search) {
            condition.push({
                [Op.or]: [
                    { name: { [Op.substring]: search } },
                    { email: { [Op.substring]: search } }
                ]
            })
        }
        const count = await User.count({
            where: {
                [Op.and]: condition
            }
        });
        const user = await User.findAll({
            limit: limit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            attributes: { exclude: ['password'] }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: "All user fetched successfully!",
            totalPage: Math.ceil(count / limit),
            currentPage: currentPage,
            data: user
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}