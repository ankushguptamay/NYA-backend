const db = require('../../Models');
const User = db.user;
const { loginByPassword, registerByPassword, changePassword, sendOTPForgetPassword, verifyOTPForPassword, generatePassword, registerByMobile, loginByMobile, otpVerificationByMobile } = require("../../Middlewares/Validate/validateUser");
const { JWT_SECRET_KEY_USER, JWT_VALIDITY, FORGET_OTP_VALIDITY, OTP_DIGITS_LENGTH, OTP_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const EmailCredential = db.emailCredential;
const ForgetOTP = db.forgetOTP;
const bcrypt = require("bcryptjs");
const generateOTP = require('../../Util/generateOTP');
const { sendEmail } = require("../../Util/sendEmail");
const { sendOTPToMobile } = require('../../Util/sendOTPToMobileNumber');
const { Op } = require("sequelize");
const SALT = 10;

// register
// login
// changePassword
// getUser

// getAllUser

exports.registerByPassword = async (req, res) => {
    try {
        // Validate Body
        const { error } = registerByPassword(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Check in paranoid true
        const isUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: req.body.email }, { mobileNumber: req.body.mobileNumber }
                ]
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

exports.loginByPassword = async (req, res) => {
    try {
        // Validate Body
        const { error } = loginByPassword(req.body);
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

exports.sendOTPForgetPassword = async (req, res) => {
    try {
        // Validate body
        const { error } = sendOTPForgetPassword(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email } = req.body;
        const isUser = await User.findOne({
            where: {
                email: email
            }
        });
        if (!isUser) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! try to login with correct credentials.'
            });
        }
        // Generate OTP for Email
        const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
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
                        <p style='font-size:14px;'>Please copy the One Time Password (OTP) below and enter it in the verification page on the  Namaste Yoga APP.</p>
                         <div class="horizontal-line"></div>
                         <p class="otp-container"> ${otp}</p>
                        <div class="horizontal-line"></div>
                        
                        <p style='font-size:14px;'>This code <span style="font-weight:600;" >expires in ${parseInt(FORGET_OTP_VALIDITY) / 1000 / 60} minutes.</span>Please,  <span style="font-weight:600;" >DONOT SHARE OR SEND THIS CODE TO ANYONE!</span></p>
                          <div class="horizontal-line"></div>
                    </div>
                </body>
                </html>`,
                userEmail: email,
                userName: isUser.name
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
            userId: isUser.id
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

exports.verifyOTPForPassword = async (req, res) => {
    try {
        // Validate body
        const { error } = verifyOTPForPassword(req.body);
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
        // Checking is user present or not
        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { email: email }, { id: isOtp.userId }
                ]
            }
        });
        if (!user) {
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
        // Checking is user present or not
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "No Details Found. Register Now!"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const bcPassword = await bcrypt.hash(password, salt);
        // Update User
        await user.update({
            ...user,
            password: bcPassword
        });
        // Generate Authtoken
        const authToken = jwt.sign(
            {
                id: user.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(201).send({
            success: true,
            message: `Password generated successfully!`,
            authToken: authToken,
            post: user.post
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.registerByMobile = async (req, res) => {
    try {
        // Body Validation
        const { error } = registerByMobile(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        // Check in paranoid true
        const isUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: req.body.email }, { mobileNumber: req.body.mobileNumber }
                ]
            },
            paranoid: false
        });
        // if (isUser) {
        //     return res.status(400).send({
        //         success: false,
        //         message: "Credentials exist!"
        //     });
        // }
        // Save in DataBase
        const user = await User.create({
            ...req.body
        });
        // Generate OTP for Email
        const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        // Sending OTP to mobile number
        const response = await sendOTPToMobile(req.body.mobileNumber, otp);
        // console.log(response);
        //  Store OTP
        await ForgetOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY),
            otp: otp,
            userId: user.id
        });
        res.status(200).json({
            success: true,
            message: `Register successfully! OTP send to ${req.body.mobileNumber}!`,
            data: {
                mobileNumber: req.body.mobileNumber
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.loginByMobile = async (req, res) => {
    try {
        // Body Validation
        const { error } = loginByMobile(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        // find user in database
        const user = await User.findOne({
            where: {
                mobileNumber: req.body.mobileNumber
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Sorry! try to login with correct credentials.'
            });
        }
        // Generate OTP for Email
        const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        // Sending OTP to mobile number
        await sendOTPToMobile(req.body.mobileNumber, otp);
        // Store OTP
        await ForgetOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY),
            otp: otp,
            userId: user.id
        });
        res.status(200).json({
            success: true,
            message: `OTP send to ${req.body.mobileNumber}!`,
            data: {
                mobileNumber: req.body.mobileNumber
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.otpVerificationByMobile = async (req, res) => {
    try {
        // Validate body
        const { error } = otpVerificationByMobile(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { mobileNumber, otp } = req.body;
        // Is Mobile Otp exist
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
        // Checking is user present or not
        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { mobileNumber: mobileNumber }, { id: isOtp.userId }
                ]
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "No Details Found. Register Now!"
            });
        }
        // is email otp expired?
        const isOtpExpired = new Date().getTime() > parseInt(isOtp.validTill);
        if (isOtpExpired) {
            await ForgetOTP.destroy({ where: { userId: isOtp.userId } });
            return res.status(400).send({
                success: false,
                message: `OTP expired!`
            });
        }
        await ForgetOTP.destroy({ where: { userId: isOtp.userId } });
        // generate JWT Token
        const authToken = jwt.sign(
            {
                id: user.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_USER,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(201).send({
            success: true,
            message: `OTP verify successfully!`,
            data: user,
            authToken: authToken
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}