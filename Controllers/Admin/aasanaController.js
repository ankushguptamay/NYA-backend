const db = require('../../Models');
const Category = db.category;
const SubCategory = db.subCategory;
const Aasana = db.aasana;
const { validateAasana } = require("../../Middlewares/Validate/validateAdmin");
const { Op } = require('sequelize');
const { deleteSingleFile } = require('../../Util/deleteFile');

exports.createAasana = async (req, res) => {
    try {
        // Validate body
        const { error } = validateAasana(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { aasanaName, aasanaDescription, aasanaTag, videoPath, videoDuration, benefits, instructions, subCategoryId, categoryId } = req.body;
        // Create Aasana
        await Aasana.create({
            aasanaDescription: aasanaDescription,
            aasanaName: aasanaName,
            aasanaTag: aasanaTag,
            videoDuration: videoDuration,
            videoPath: videoPath,
            benefits: benefits,
            instructions: instructions,
            subCategoryId: subCategoryId,
            categoryId: categoryId
        });

        res.status(201).send({
            success: true,
            message: "Aasana created successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.getAasanaForAdmin = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        // Pagination
        const recordLimit = parseInt(limit) || 10;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * recordLimit;
            currentPage = parseInt(page);
        }
        // Search 
        const condition = [];
        if (search) {
            condition.push({
                [Op.or]: [
                    { aasanaName: { [Op.substring]: search } },
                    { aasanaTag: { [Op.substring]: search } },
                    { aasanaDescription: { [Op.substring]: search } }
                ]
            })
        }
        // Count All Aasana
        const totalAasana = await Aasana.count({
            where: {
                [Op.and]: condition
            }
        });
        // All Aasana
        const aasana = await Aasana.findAll({
            limit: recordLimit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            include: [{
                model: Category,
                as: "category",
            }, {
                model: SubCategory,
                as: "subCategory"
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(201).send({
            success: true,
            message: "Aasana fatched successfully",
            totalPage: Math.ceil(totalAasana / recordLimit),
            currentPage: currentPage,
            data: aasana
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};


exports.updateAasana = async (req, res) => {
    // Validate body
    const { error } = validateAasana(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const id = req.params.id;
        const { aasanaName, aasanaDescription, aasanaTag, videoPath, videoDuration, benefits, instructions, subCategoryId, categoryId } = req.body;
        // find Aasana
        const aasana = await Aasana.findOne({
            where: {
                id: id
            }
        });
        if (!aasana) {
            return res.status(400).send({
                success: false,
                message: "Aasana is not present!"
            });
        }
        // update Aasana
        await aasana.update({
            aasanaDescription: aasanaDescription,
            aasanaName: aasanaName,
            aasanaTag: aasanaTag,
            videoDuration: videoDuration,
            videoPath: videoPath,
            benefits: benefits,
            instructions: instructions,
            subCategoryId: subCategoryId,
            categoryId: categoryId
        });
        res.status(201).send({
            success: true,
            message: "Aasana updated successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.publicAasana = async (req, res) => {
    try {
        const id = req.params.id;
        // find Aasana
        const aasana = await Aasana.findOne({
            where: {
                id: id
            }
        });
        if (!aasana) {
            return res.status(400).send({
                success: false,
                message: "Aasana is not present!"
            });
        }
        // update Aasana
        await aasana.update({
            ...aasana,
            publicStatus: true
        });
        res.status(201).send({
            success: true,
            message: "Aasana publish successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.unPublicAasana = async (req, res) => {
    try {
        const id = req.params.id;
        // find Aasana
        const aasana = await Aasana.findOne({
            where: {
                id: id
            }
        });
        if (!aasana) {
            return res.status(400).send({
                success: false,
                message: "Aasana is not present!"
            });
        }
        // update Aasana
        await aasana.update({
            ...aasana,
            publicStatus: false
        });
        res.status(201).send({
            success: true,
            message: "Aasana un publish successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.hardDeleteAasana = async (req, res) => {
    try {
        const id = req.params.id;
        // find Aasana
        const aasana = await Aasana.findOne({
            where: {
                id: id
            }
        });
        if (!aasana) {
            return res.status(400).send({
                success: false,
                message: "Aasana is not present!"
            });
        }
        // update Aasana
        await aasana.destroy({
            force: true
        });
        res.status(201).send({
            success: true,
            message: "Aasana un public successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.getAasanaForUser = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        // Pagination
        const recordLimit = parseInt(limit) || 10;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * recordLimit;
            currentPage = parseInt(page);
        }
        // Search 
        const condition = [{ publicStatus: true }];
        if (search) {
            condition.push({
                [Op.or]: [
                    { aasanaName: { [Op.substring]: search } },
                    { aasanaTag: { [Op.substring]: search } },
                    { aasanaDescription: { [Op.substring]: search } }
                ]
            })
        }
        // Count All Aasana
        const totalAasana = await Aasana.count({
            where: {
                [Op.and]: condition
            }
        });
        // All Aasana
        const aasana = await Aasana.findAll({
            limit: recordLimit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            include: [{
                model: Category,
                as: "category",
                where: { publicStatus: true },
                required: false
            }, {
                model: SubCategory,
                as: "subCategory",
                where: { publicStatus: true },
                required: false
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(201).send({
            success: true,
            message: "Aasana fatched successfully",
            totalPage: Math.ceil(totalAasana / recordLimit),
            currentPage: currentPage,
            data: aasana
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.getAasanaBySubCategoryId = async (req, res) => {
    try {
        // All Aasana
        const aasana = await Aasana.findAll({
            where: {
                subCategoryId: req.params.subCategoryId,
                publicStatus: true
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(201).send({
            success: true,
            message: "Aasana fatched successfully",
            data: aasana
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};