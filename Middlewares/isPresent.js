const db = require('../Models');
const Admin = db.admin;
const User = db.user;

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