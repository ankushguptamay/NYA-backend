const db = require('../../Models');
const Institute = db.institute;
const { loginUser, registerInstitute, changePassword } = require("../../Middlewares/Validate/validateUser");
const { JWT_SECRET_KEY_INSTITUTE, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const SALT = 10;

// register
// login
// changePassword
// getInstitute

// getAllInstitute

exports.register = async (req, res) => {
    try {
        // Validate Body
        const { error } = registerInstitute(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Check in paranoid true
        const isInstitute = await Institute.findOne({
            where: {
                [Op.or]: [
                    { centerName: req.body.centerName },
                    { email: req.body.email }
                ]
            },
            paranoid: false
        });
        if (isInstitute) {
            return res.status(400).send({
                success: false,
                message: "Credentials exist!"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Create Institute in database
        const institute = await Institute.create({
            email: req.body.email,
            seatingCapacity: req.body.seatingCapacity,
            mobileNumber: req.body.mobileNumber,
            centerName: req.body.centerName,
            location: req.body.location,
            city: req.body.city,
            address: req.body.address,
            password: hashedPassword
        });
        // generate JWT Token
        const authToken = jwt.sign(
            {
                id: institute.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_INSTITUTE,
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
        const institute = await Institute.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!institute) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Check approval status
        if (institute.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Wait for admin approval!"
            });
        }
        // Compare password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.password,
            institute.password
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
                id: institute.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_INSTITUTE,
            { expiresIn: JWT_VALIDITY } // five day
        );
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Loged in successfully!',
            authToken: authToken
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
        const institute = await Institute.findOne({
            where: {
                email: req.institute.email
            }
        });
        if (!institute) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Check approval status
        if (institute.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Wait for admin approval!"
            });
        }
        // Compare current password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.oldPassword,
            institute.password
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
        await institute.update({
            ...institute,
            password: hashedPassword
        });
        // Generate JWT Token
        const authToken = jwt.sign(
            {
                id: institute.id,
                email: institute.email
            },
            JWT_SECRET_KEY_INSTITUTE,
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

exports.getInstitute = async (req, res) => {
    try {
        const institute = await Institute.findOne({
            where: {
                email: req.institute.email, id: req.institute.id
            },
            attributes: { exclude: ['password'] }
        });
        if (!institute) {
            return res.status(400).send({
                success: false,
                message: "Institute is not present!"
            });
        }
        // Check approval status
        if (institute.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Wait for admin approval!"
            });
        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Institute Profile Fetched successfully!",
            data: institute
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getAllInstitute = async (req, res) => {
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
        const count = await Institute.count({
            where: {
                [Op.and]: condition
            }
        });
        const institute = await Institute.findAll({
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
            message: "All institute fetched successfully!",
            totalPage: Math.ceil(count / limit),
            currentPage: currentPage,
            data: institute
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.approveInstitute = async (req, res) => {
    try {
        const institute = await Institute.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!institute) {
            return res.status(400).send({
                success: false,
                message: "Institute is not present!"
            });
        }
        await institute.update({
            ...institute,
            approvedByAdmin: true
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Institute approved successfully!",
            data: institute
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.disApproveInstitute = async (req, res) => {
    try {
        const institute = await Institute.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!institute) {
            return res.status(400).send({
                success: false,
                message: "Institute is not present!"
            });
        }
        await institute.update({
            ...institute,
            approvedByAdmin: false
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Institute disapproved successfully!",
            data: institute
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}