const db = require('../../Models');
const Category = db.category;
const { validateCategory } = require("../../Middlewares/Validate/validateAdmin");
const { Op } = require('sequelize');
const { deleteSingleFile } = require('../../Util/deleteFile');

exports.createCategory = async (req, res) => {
    try {
        //File
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Select a Image!"
            });
        }
        // Validate body
        const { error } = validateCategory(req.body);
        if (error) {
            deleteSingleFile(req.file.path);
            return res.status(400).send(error.details[0].message);
        }
        const { categoryName } = req.body;
        // Unique category
        const isCategory = await Category.findOne({
            where: {
                categoryName: categoryName
            },
            paranoid: false
        });
        if (isCategory) {
            deleteSingleFile(req.file.path);
            return res.status(400).send({
                success: false,
                message: "Category name should be unique!"
            });
        }
        // Create category
        await Category.create({
            categoryName: categoryName,
            categoryImage_Path: req.file.path,
            categoryImage_Originalname: req.file.originalname,
            categoryImage_FileName: req.file.filename
        });

        res.status(201).send({
            success: true,
            message: "Category created successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(201).send({
            success: true,
            message: "Category fatched successfully",
            data: category
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    // Validate body
    const { error } = validateCategory(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const id = req.params.id;
        const { categoryName } = req.body;
        // find category
        const category = await Category.findOne({
            where: {
                id: id
            }
        });
        if (!category) {
            return res.status(400).send({
                success: false,
                message: "Category is not present!"
            });
        }
        // Unique category
        if (category.categoryName !== categoryName) {
            const isCategory = await Category.findOne({
                where: {
                    categoryName: categoryName
                },
                paranoid: false
            });
            if (isCategory) {
                return res.status(400).send({
                    success: false,
                    message: "Category name should be unique!"
                });
            }
        }
        let imagePath = category.categoryImage_Path;
        let imageOriginalName = category.categoryImage_Originalname;
        let imageFileName = category.categoryImage_FileName;
        if (req.file) {
            imagePath = req.file.path;
            imageOriginalName = req.file.originalname;
            imageFileName = req.file.filename
            deleteSingleFile(category.categoryImage_Path);
        }
        // Create category
        await category.update({
            categoryName: categoryName,
            categoryImage_Path: imagePath,
            categoryImage_Originalname: imageOriginalName,
            categoryImage_FileName: imageFileName
        });
        res.status(201).send({
            success: true,
            message: "Category updated successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.publishCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findOne({
            where: {
                id: id
            }
        });
        if (!category) {
            return res.status(400).send({
                success: false,
                message: "Category is not present!"
            });
        }
        // update category
        await category.update({
            ...category,
            publicStatus: true
        });
        res.status(201).send({
            success: true,
            message: "Category publish successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.unPublishCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findOne({
            where: {
                id: id
            }
        });
        if (!category) {
            return res.status(400).send({
                success: false,
                message: "Category is not present!"
            });
        }
        // update category
        await category.update({
            ...category,
            publicStatus: false
        });
        res.status(201).send({
            success: true,
            message: "Category un publish successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};