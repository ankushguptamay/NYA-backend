const db = require('../../Models');
const Admin = db.admin;
const EmailCredential = db.emailCredential;
const ForgetOTP = db.forgetOTP;
const { adminLogin, adminRegistration } = require("../../Middlewares/Validate/validateAdmin");
const { changePassword, sendOTP, verifyOTP, generatePassword } = require("../../Middlewares/Validate/validateUser");
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const emailOTP = require('../../Util/generateOTP');
const { sendEmail } = require("../../Util/sendEmail");
const SALT = 10;
const { JWT_SECRET_KEY_ADMIN, JWT_VALIDITY, FORGET_OTP_VALIDITY, OTP_DIGITS_LENGTH } = process.env;

//register Admin
exports.registerAdmin = async (req, res) => {
    // Validate body
    const { error } = adminRegistration(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const { email, password, name, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "Password should be match!"
            });
        }
        const isAdmin = await Admin.findOne({ where: { email: email } });
        if (isAdmin) {
            return res.status(400).send({
                success: false,
                message: "Admin already registered"
            });
        }
        // Generate hash password of newPassword
        const salt = await bcrypt.genSalt(SALT);
        const bcPassword = await bcrypt.hash(req.body.password, salt);

        const admin = await Admin.create({
            name: name,
            email: email,
            password: bcPassword
        });
        const data = {
            id: admin.id,
            email: admin.email,
        }
        const authToken = jwt.sign(data, JWT_SECRET_KEY_ADMIN, { expiresIn: JWT_VALIDITY });
        res.status(201).send({
            success: true,
            message: "Admin registered successfully",
            authToken: authToken
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

//Login Admin
exports.loginAdmin = async (req, res) => {
    // Validate body
    const { error } = adminLogin(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const { email, password } = req.body;
        const isAdmin = await Admin.findOne({ where: { email: email } });
        if (!isAdmin) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! try to login with currect credentials.'
            });
        }
        const compairPassword = await bcrypt.compare(password, isAdmin.password);
        if (!compairPassword) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! try to login with currect credentials.'
            });
        }
        const data = {
            id: isAdmin.id,
            email: isAdmin.email
        }
        const authToken = jwt.sign(data, JWT_SECRET_KEY_ADMIN, { expiresIn: JWT_VALIDITY });
        res.status(201).send({
            success: true,
            message: "Admin LogedIn successfully",
            authToken: authToken
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
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
        const admin = await Admin.findOne({
            where: {
                email: req.admin.email
            }
        });
        if (!admin) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Compare current password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.oldPassword,
            admin.password
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
        await admin.update({
            ...admin,
            password: hashedPassword
        });
        // Generate JWT Token
        const authToken = jwt.sign(
            {
                id: admin.id,
                email: admin.email
            },
            JWT_SECRET_KEY_ADMIN,
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

exports.sendOTPForForgetPassword = async (req, res) => {
    try {
        // Validate body
        const { error } = sendOTP(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email } = req.body;
        const isAdmin = await Admin.findOne({
            where: {
                email: email
            }
        });
        if (!isAdmin) {
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
                userName: isAdmin.name
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
            userId: isAdmin.id
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
        const admin = await Admin.findOne({
            where: {
                [Op.and]: [
                    { email: email }, { id: isOtp.userId }
                ]
            }
        });
        if (!admin) {
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
        // Checking is admin present or not
        const admin = await Admin.findOne({
            where: {
                email: email
            }
        });
        if (!admin) {
            return res.status(400).send({
                success: false,
                message: "No Details Found. Register Now!"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const bcPassword = await bcrypt.hash(password, salt);
        // Update admin
        await admin.update({
            ...admin,
            password: bcPassword
        });
        // Generate Authtoken
        const authToken = jwt.sign(
            {
                id: admin.id,
                email: req.body.email
            },
            JWT_SECRET_KEY_ADMIN,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(201).send({
            success: true,
            message: `Password generated successfully!`,
            authToken: authToken
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};