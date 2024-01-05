const db = require('../../Models');
const Instructor = db.instructor;
const { loginUser, registerInstructor, changePassword } = require("../../Middlewares/Validate/validateUser");
const { JWT_SECRET_KEY_INSTRUCTOR, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const SALT = 10;

// register
// login
// changePassword
// getInstructor

// getAllInstructor

exports.register = async (req, res) => {
    try {
        // Validate Body
        const { error } = registerInstructor(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Check in paranoid true
        const isInstructor = await Instructor.findOne({
            where: {
                [Op.or]: [
                    { NYCCertificateNumber: req.body.NYCCertificateNumber },
                    { email: req.body.email }
                ]
            },
            paranoid: false
        });
        if (isInstructor) {
            return res.status(400).send({
                success: false,
                message: "Credentials exist!"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Create Instructor in database
        const instructor = await Instructor.create({
            email: req.body.email,
            name: req.body.name,
            NYCCertificateNumber: req.body.NYCCertificateNumber,
            password: hashedPassword
        });
        // generate JWT Token
        const authToken = jwt.sign(
            {
                id: instructor.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_INSTRUCTOR,
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
        const instructor = await Instructor.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!instructor) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Check approval status
        if (instructor.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Wait for admin approval!"
            });
        }
        // Compare password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.password,
            instructor.password
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
                id: instructor.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_INSTRUCTOR,
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
        const instructor = await Instructor.findOne({
            where: {
                email: req.instructor.email
            }
        });
        if (!instructor) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Check approval status
        if (instructor.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Wait for admin approval!"
            });
        }
        // Compare current password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.oldPassword,
            instructor.password
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
        await instructor.update({
            ...instructor,
            password: hashedPassword
        });
        // Generate JWT Token
        const authToken = jwt.sign(
            {
                id: instructor.id,
                email: instructor.email
            },
            JWT_SECRET_KEY_INSTRUCTOR,
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

exports.getInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.findOne({
            where: {
                email: req.instructor.email, id: req.instructor.id
            },
            attributes: { exclude: ['password'] }
        });
        if (!instructor) {
            return res.status(400).send({
                success: false,
                message: "Instructor is not present!"
            });
        }
        // Check approval status
        if (instructor.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Wait for admin approval!"
            });
        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Instructor Profile Fetched successfully!",
            data: instructor
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getAllInstructor = async (req, res) => {
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
        const count = await Instructor.count({
            where: {
                [Op.and]: condition
            }
        });
        const instructor = await Instructor.findAll({
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
            message: "All instructor fetched successfully!",
            totalPage: Math.ceil(count / limit),
            currentPage: currentPage,
            data: instructor
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.approveInstructorRegistration = async (req, res) => {
    try {
        const instructor = await Instructor.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!instructor) {
            return res.status(400).send({
                success: false,
                message: "Instructor is not present!"
            });
        }
        await instructor.update({
            ...instructor,
            approvedByAdmin: true
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Instructor approved successfully!",
            data: instructor
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.disApproveInstructorRegistration = async (req, res) => {
    try {
        const instructor = await Instructor.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!instructor) {
            return res.status(400).send({
                success: false,
                message: "Instructor is not present!"
            });
        }
        await instructor.update({
            ...instructor,
            approvedByAdmin: false
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Instructor disapproved successfully!",
            data: instructor
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

// exports.updateInstructor = async (req, res) => {
//     try {
//         // Validate Body
//         const { error } = registerInstructor(req.body);
//         if (error) {
//             return res.status(400).send(error.details[0].message);
//         }
//         // Check in paranoid true
//         const isInstructor = await Instructor.findOne({
//             where: {
//                 [Op.or]: [
//                     { NYCCertificateNumber: req.body.NYCCertificateNumber },
//                     { email: req.body.email }
//                 ]
//             },
//             paranoid: false
//         });
//         if (isInstructor) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Credentials exist!"
//             });
//         }
//         const trainerAs = (req.body.trainerAs).toUpperCase();
//         if (trainerAs !== 'PUBLIC' || trainerAs !== 'PRIVATE' || trainerAs !== 'GOVERNMENT') {
//             return res.status(400).send({
//                 success: false,
//                 message: "Public, Private and Government accepted!"
//             });
//         }
//         // Hash password
//         const salt = await bcrypt.genSalt(SALT);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);
//         // Create Instructor in database
//         const instructor = await Instructor.create({
//             email: req.body.email,
//             name: req.body.name,
//             mobileNumber: req.body.mobileNumber,
//             NYCCertificateNumber: req.body.NYCCertificateNumber,
//             location: req.body.location,
//             city: req.body.city,
//             address: req.body.address,
//             trainerAs: trainerAs,
//             password: hashedPassword
//         });
//         // generate JWT Token
//         const authToken = jwt.sign(
//             {
//                 id: instructor.id,
//                 email: req.body.email
//             },
//             JWT_SECRET_KEY_INSTRUCTOR,
//             { expiresIn: JWT_VALIDITY } // five day
//         );
//         // Send final success response
//         res.status(200).send({
//             success: true,
//             message: 'Registered successfully!',
//             authToken: authToken
//         });
//     } catch (err) {
//         res.status(500).send({
//             success: false,
//             message: err.message
//         });
//     }
// };