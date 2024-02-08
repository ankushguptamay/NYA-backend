const db = require('../../Models');
const Celebrity = db.celebrity;
const { validateCelebrity } = require("../../Middlewares/Validate/validateAdmin");
const { Op } = require('sequelize');

exports.createCelebrity = async (req, res) => {
    try {
        // Validate body
        const { error } = validateCelebrity(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { celebrityName, videoPath } = req.body;
        await Celebrity.create({
            celebrityName: celebrityName,
            videoPath: videoPath
        });
        res.status(201).send({
            success: true,
            message: "Celebrity created successfully."
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.getCelebrity = async (req, res) => {
    try {
        const celebrities = await Celebrity.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(201).send({
            success: true,
            message: "Celebrity fatched successfully.",
            data: celebrities
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.updateCelebrity = async (req, res) => {
    try {
        // Validate body
        const { error } = validateCelebrity(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { celebrityName, videoPath } = req.body;
        const celebrities = await Celebrity.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!celebrities) {
            return res.status(400).send({
                success: true,
                message: "This celebrity is not present!"
            });
        }
        await celebrities.update({
            celebrityName: celebrityName,
            videoPath: videoPath
        });
        res.status(201).send({
            success: true,
            message: "Celebrity updated successfully."
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.deleteCelebrity = async (req, res) => {
    try {
        const celebrities = await Celebrity.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!celebrities) {
            return res.status(400).send({
                success: true,
                message: "This celebrity is not present!"
            });
        }
        await celebrities.destroy();
        res.status(201).send({
            success: true,
            message: "Celebrity deleted successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};