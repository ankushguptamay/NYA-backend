const db = require('../Models');
const Admin = db.admin;
const User = db.user;
const Institute = db.institute;
const Instructor = db.instructor;

exports.isAdmin = async (req, res, next) => {
    try {
        const email = req.admin.email;
        const id = req.admin.id;
        const isAdmin = await Admin.findOne({
            where: {
                id: id,
                email: email
            }
        });
        if (!isAdmin) {
            return res.status(400).send({
                success: false,
                message: "Admin is not present!"
            });
        };
        next();
    } catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
}

exports.isUser = async (req, res, next) => {
    try {
        const email = req.user.email;
        const id = req.user.id;
        const isUser = await User.findOne({
            where: {
                id: id,
                email: email
            }
        });
        if (!isUser) {
            return res.status(400).send({
                success: false,
                message: "User is not present!"
            });
        };
        next();
    } catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
}

exports.isInstitute = async (req, res, next) => {
    try {
        const email = req.institute.email;
        const id = req.institute.id;
        const isInstitute = await Institute.findOne({
            where: {
                id: id,
                email: email
            }
        });
        if (!isInstitute) {
            return res.status(400).send({
                success: false,
                message: "Institute is not present!"
            });
        };
        // Check approval status
        if (isInstitute.approvedByAdmin === false) {
            return res.status(400).send({
                success: false,
                message: "Wait for admin approval!"
            });
        }
        next();
    } catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
}

exports.isInstructor = async (req, res, next) => {
    try {
        const email = req.instructor.email;
        const id = req.instructor.id;
        const isInstructor = await Instructor.findOne({
            where: {
                id: id,
                email: email
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
                message: "Wait for admin approval!"
            });
        }
        next();
    } catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
}