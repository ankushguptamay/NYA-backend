const db = require('../../Models');
const SubCategory = db.subCategory;
const Category = db.category;
const { validateSubCategory } = require("../../Middlewares/Validate/validateAdmin");
const { deleteSingleFile } = require('../../Util/deleteFile');
const { Op } = require('sequelize');

exports.createSubCategory = async (req, res) => {
    try {
        // file
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Select a Image!"
            });
        }
        // Validate body
        const { error } = validateSubCategory(req.body);
        if (error) {
            deleteSingleFile(req.file.path);
            return res.status(400).send(error.details[0].message);
        }
        const { subCategoryName, subCategoryDescription, categoryId } = req.body;
        // Unique category
        const isSubCategory = await SubCategory.findOne({
            where: {
                subCategoryName: subCategoryName
            },
            paranoid: false
        });
        if (isSubCategory) {
            deleteSingleFile(req.file.path);
            return res.status(400).send({
                success: false,
                message: "Subcategory name should be unique!"
            });
        }
        // Create category
        await SubCategory.create({
            subCategoryDescription: subCategoryDescription,
            subCategoryName: subCategoryName,
            subCategoryImage_Path: req.file.path,
            subCategoryImage_Originalname: req.file.originalname,
            subCategoryImage_FileName: req.file.filename,
            categoryId: categoryId
        });

        res.status(201).send({
            success: true,
            message: "Sub category created successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.getSubCategoryForAdmin = async (req, res) => {
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
            condition.push({ subCategoryName: { [Op.substring]: search } });
        }
        // Count All Subcategory
        const totalSubCategory = await SubCategory.count({
            where: {
                [Op.and]: condition
            }
        });
        // All Subcategory
        const subCategories = await SubCategory.findAll({
            limit: recordLimit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            include: [{
                model: Category,
                as: "category",
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(201).send({
            success: true,
            message: "Subcategory fatched successfully",
            totalPage: Math.ceil(totalSubCategory / recordLimit),
            currentPage: currentPage,
            data: subCategories
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        // Validate body
        const { error } = validateSubCategory(req.body);
        if (error) {
            deleteSingleFile(req.file.path);
            return res.status(400).send(error.details[0].message);
        }
        const id = req.params.id;
        const { subCategoryName, subCategoryDescription, categoryId } = req.body;
        // find category
        const subCategory = await SubCategory.findOne({
            where: {
                id: id
            }
        });
        if (!subCategory) {
            return res.status(400).send({
                success: false,
                message: "Subcategory is not present!"
            });
        }
        // Unique Subcategory
        if (subCategory.subCategoryName !== subCategoryName) {
            const isCategory = await SubCategory.findOne({
                where: {
                    subCategoryName: subCategoryName
                },
                paranoid: false
            });
            if (isCategory) {
                return res.status(400).send({
                    success: false,
                    message: "Subcategory name should be unique!"
                });
            }
        }
        let imagePath = subCategory.subCategoryImage_Path;
        let imageOriginalName = subCategory.subCategoryImage_Originalname;
        let imageFileName = subCategory.subCategoryImage_FileName;
        if (req.file) {
            imagePath = req.file.path;
            imageOriginalName = req.file.originalname;
            imageFileName = req.file.filename
            deleteSingleFile(subCategory.subCategoryImage_Path);
        }
        // Create Subcategory
        await subCategory.update({
            subCategoryDescription: subCategoryDescription,
            subCategoryName: subCategoryName,
            subCategoryImage_Path: imagePath,
            subCategoryImage_Originalname: imageOriginalName,
            subCategoryImage_FileName: imageFileName,
            categoryId: categoryId
        });
        res.status(201).send({
            success: true,
            message: "Subcategory updated successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.publicSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const subCategory = await SubCategory.findOne({
            where: {
                id: id
            }
        });
        if (!subCategory) {
            return res.status(400).send({
                success: false,
                message: "Subcategory is not present!"
            });
        }
        // update category
        await subCategory.update({
            ...subCategory,
            publicStatus: true
        });
        res.status(201).send({
            success: true,
            message: "Subcategory public successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.unPublicSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const subCategory = await SubCategory.findOne({
            where: {
                id: id
            }
        });
        if (!subCategory) {
            return res.status(400).send({
                success: false,
                message: "Subcategory is not present!"
            });
        }
        // update category
        await subCategory.update({
            ...subCategory,
            publicStatus: false
        });
        res.status(201).send({
            success: true,
            message: "Subcategory un public successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};