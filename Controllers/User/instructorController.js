const db = require('../../Models');
const Instructor = db.instructor;
const InstructorUpdation = db.instructorUpdation;
const EmailCredential = db.emailCredential;
const ForgetOTP = db.forgetOTP;
const { loginUser, registerInstructor, changePassword, updateInstructor, sendOTP, verifyOTP, generatePassword } = require("../../Middlewares/Validate/validateUser");
const { JWT_SECRET_KEY_INSTRUCTOR, JWT_VALIDITY, FORGET_OTP_VALIDITY, OTP_DIGITS_LENGTH } = process.env;
const emailOTP = require('../../Util/generateOTP');
const { sendEmail } = require("../../Util/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const SALT = 10;

// register
// login
// changePassword
// getInstructor
// updateInstructor

// getAllInstructor
// approveInstructorRegistration
// disApproveInstructorRegistration
// getAllInstructorUpdation
// approveInstructorUpdation
// disApproveInstructorUpdation

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
            authToken: authToken,
            name: instructor.name
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
        const limit = parseInt(req.query.limit) || 10;
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

exports.updateInstructor = async (req, res) => {
    try {
        // Validate Body
        const { error } = updateInstructor(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Check
        const isInstructor = await Instructor.findOne({
            where: {
                id: req.instructor.id,
                email: req.instructor.email
            }
        });
        if (!isInstructor) {
            return res.status(400).send({
                success: false,
                message: "Instructor is not present!"
            });
        };
        // Check approval status
        if (isInstructor.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Your profile is not approved by NVA!"
            });
        }
        const trainerAs = (req.body.trainerAs).toUpperCase();
        // Create Instructor in database
        await InstructorUpdation.create({
            email: req.instructor.email,
            NYCCertificateNumber: isInstructor.NYCCertificateNumber,
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            location: req.body.location,
            city: req.body.city,
            address: req.body.address,
            trainerAs: trainerAs,
            instructorId: req.instructor.id
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Updated successfully!'
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.getAllInstructorUpdation = async (req, res) => {
    try {
        const { page, search } = req.query;
        // Pagination
        const limit = parseInt(req.query.limit) || 10;
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
        const count = await InstructorUpdation.count({
            where: {
                [Op.and]: condition
            }
        });
        const instructor = await InstructorUpdation.findAll({
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

exports.approveInstructorUpdation = async (req, res) => {
    try {
        const instructorUpdation = await InstructorUpdation.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!instructorUpdation) {
            return res.status(400).send({
                success: false,
                message: "Instructor updation request is not present!"
            });
        }
        await Instructor.update({
            name: instructorUpdation.name,
            mobileNumber: instructorUpdation.mobileNumber,
            location: instructorUpdation.location,
            city: instructorUpdation.city,
            address: instructorUpdation.address,
            trainerAs: instructorUpdation.trainerAs,
        }, {
            where: {
                id: instructorUpdation.instructorId
            }
        });
        // update updation request
        await instructorUpdation.update({ where: { approvedByAdmin: true } });
        // Soft delete updation request
        await instructorUpdation.destroy();
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Instructor updated successfully!"
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.disApproveInstructorUpdation = async (req, res) => {
    try {
        const instructorUpdation = await InstructorUpdation.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!instructorUpdation) {
            return res.status(400).send({
                success: false,
                message: "Instructor updation request is not present!"
            });
        }
        // update updation request
        await instructorUpdation.update({ where: { approvedByAdmin: true } });
        // Soft delete updation request
        await instructorUpdation.destroy();
        // Send final success response
        res.status(200).send({
            success: true,
            message: "Instructor disapproved successfully!"
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.sendOTPForForgetPassword = async (req, res) => {
    try {
        // Validate body
        const { error } = sendOTP(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email } = req.body;
        const isInstructor = await Instructor.findOne({
            where: {
                email: email
            }
        });
        if (!isInstructor) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! try to login with currect credentials.'
            });
        }
        // Generate OTP for Email
        const otp = emailOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        // Update sendEmail 0 every day
        const date = JSON.stringify(new Date());
        const todayDate = `${date.slice(1, 11)}`;
        const changeUpdateDate = await EmailCredential.findAll({
            where: {
                updatedAt: { [Op.lt]: todayDate }
            },
            order: [
                ['createdAt', 'ASC']
            ]
        });
        for (let i = 0; i < changeUpdateDate.length; i++) {
            // console.log("hii");
            await EmailCredential.update({
                emailSend: 0
            }, {
                where: {
                    id: changeUpdateDate[i].id
                }
            });
        }
        // finalise email credentiel
        const emailCredential = await EmailCredential.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });
        let finaliseEmailCredential;
        for (let i = 0; i < emailCredential.length; i++) {
            if (parseInt(emailCredential[i].emailSend) < 300) {
                finaliseEmailCredential = emailCredential[i];
                break;
            }
        }
        if (emailCredential.length <= 0) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! Some server error!'
            });
        }
        if (!finaliseEmailCredential) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! Some server error! Try after some time'
            });
        }
        // Send OTP to Email By Brevo
        if (finaliseEmailCredential.plateForm === "BREVO") {
            const options = {
                brevoEmail: finaliseEmailCredential.email,
                brevoKey: finaliseEmailCredential.EMAIL_API_KEY,
                headers: { "OTP for regenerate password": "123A" },
                htmlContent: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Card</title>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap">
                    <style>
                        body {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            font-family: 'Poppins', sans-serif;
                        }
                        .verification-card {
                            padding: 30px;
                            border: 1px solid #ccc;
                            box-shadow: 0 0 10px rgba(0, 0, 255, 0.1);
                            max-width: 400px;
                            width: 100%;
                            font-family: 'Poppins', sans-serif;
                        }
                        .logo-img {
                            max-width: 100px;
                            height: auto;
                        }
                        .otp-container{
                            font-size: 32px;
                            font-weight: bold;
                            text-align:center;
                            color:#1c2e4a;
                            font-family: 'Poppins', sans-serif;
                          }
                        .horizontal-line {
                            border-top: 1px solid #ccc;
                            margin: 15px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="verification-card">
                        <img src="https://images.unsplash.com/photo-1636051028886-0059ad2383c8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Logo" class="logo-img">
                        <p style='font-size:14px'>Hi <span style=" font-weight:600">${email},</span></p>
                        <p style='font-size:14px;'>Please copy the One Time Password (OTP) below and enter it in the verification page on the Namaste Yoga APP.</p>
                         <div class="horizontal-line"></div>
                         <p class="otp-container"> ${otp}</p>
                        <div class="horizontal-line"></div>
                        
                        <p style='font-size:14px;'>This code <span style="font-weight:600;" >expires in ${parseInt(FORGET_OTP_VALIDITY) / 1000 / 60} minutes.</span>Please,  <span style="font-weight:600;" >DONOT SHARE OR SEND THIS CODE TO ANYONE!</span></p>
                          <div class="horizontal-line"></div>
                    </div>
                </body>
                </html>`,
                userEmail: email,
                userName: isInstructor.name
            }
            const response = await sendEmail(options);
            // console.log(response);
            const increaseNumber = parseInt(finaliseEmailCredential.emailSend) + 1;
            await EmailCredential.update({
                emailSend: increaseNumber
            }, { where: { id: finaliseEmailCredential.id } });
        }
        //  Store OTP
        await ForgetOTP.create({
            vallidTill: new Date().getTime() + parseInt(FORGET_OTP_VALIDITY),
            otp: otp,
            userId: isInstructor.id
        });
        res.status(201).send({
            success: true,
            message: `OTP send to email successfully! Valid for ${FORGET_OTP_VALIDITY / (60 * 1000)} minutes!`,
            data: { email: email }
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        // Validate body
        const { error } = verifyOTP(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email, otp } = req.body;
        // Is Email Otp exist
        const isOtp = await ForgetOTP.findOne({
            where: {
                otp: otp
            }
        });
        if (!isOtp) {
            return res.status(400).send({
                success: false,
                message: `Invalid OTP!`
            });
        }
        // Checking is instructor present or not
        const instructor = await Instructor.findOne({
            where: {
                [Op.and]: [
                    { email: email }, { id: isOtp.userId }
                ]
            }
        });
        if (!instructor) {
            return res.status(400).send({
                success: false,
                message: "No Details Found. Register Now!"
            });
        }
        // is email otp expired?
        const isOtpExpired = new Date().getTime() > parseInt(isOtp.vallidTill);
        if (isOtpExpired) {
            await ForgetOTP.destroy({ where: { userId: isOtp.userId } });
            return res.status(400).send({
                success: false,
                message: `OTP expired!`
            });
        }
        await ForgetOTP.destroy({ where: { userId: isOtp.userId } });
        res.status(201).send({
            success: true,
            message: `OTP matched successfully!`,
            data: { email: email }
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.generatePassword = async (req, res) => {
    try {
        // Validate body
        const { error } = generatePassword(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "Password should be match!"
            });
        }
        // Checking is instructor present or not
        const instructor = await Instructor.findOne({
            where: {
                email: email
            }
        });
        if (!instructor) {
            return res.status(400).send({
                success: false,
                message: "No Details Found. Register Now!"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const bcPassword = await bcrypt.hash(password, salt);
        // Update instructor
        await instructor.update({
            ...instructor,
            password: bcPassword
        });
        // Generate Authtoken
        const authToken = jwt.sign(
            {
                id: instructor.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_INSTRUCTOR,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(201).send({
            success: true,
            message: `Password generated successfully!`,
            authToken: authToken,
            post: instructor.post
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};