const db = require('../../Models');
const SubCategory = db.subCategory;
const Category = db.category;
const { validateSubCategory } = require("../../Middlewares/Validate/validateAdmin");
const { deleteSingleFile } = require('../../Util/deleteFile');
const { Op } = require('sequelize');

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        const imagePath = `./Resources/${(req.file.filename)}`
        const response = await cloudinary.uploader.upload(imagePath);
        // delete file from resource/servere
        deleteSingleFile(req.file.path);
        // Create category
        await SubCategory.create({
            cloudinaryFileId: response.public_id,
            subCategoryDescription: subCategoryDescription,
            subCategoryName: subCategoryName,
            subCategoryImage_Path: response.secure_url,
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
            if (req.file) {
                deleteSingleFile(req.file.path);
            }
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
        const previousImage = subCategory.subCategoryImage_FileName;
        let imagePath = subCategory.subCategoryImage_Path;
        let imageOriginalName = subCategory.subCategoryImage_Originalname;
        let imageFileName = subCategory.subCategoryImage_FileName;
        let cloudinaryFileId = subCategory.cloudinaryFileId;
        if (req.file) {
            const imageCloudPath = `./Resources/${(req.file.filename)}`
            const response = await cloudinary.uploader.upload(imageCloudPath);
            // delete file from resource/servere
            deleteSingleFile(req.file.path);
            if (cloudinaryFileId) {
                await cloudinary.uploader.destroy(cloudinaryFileId);
            }
            cloudinaryFileId = response.public_id;
            imagePath = response.secure_url;
            imageOriginalName = req.file.originalname;
            imageFileName = req.file.filename
        }
        // Create Subcategory
        await subCategory.update({
            cloudinaryFileId: cloudinaryFileId,
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
            message: "Subcategory publish successfully"
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
            message: "Subcategory un publish successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.getSubCategoryForUser = async (req, res) => {
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
                where: { publicStatus: true },
                as: "category",
                required: false
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

exports.getSubCategoryForUserByCategoryId = async (req, res) => {
    try {
        const subCategories = await SubCategory.findAll({
            where: {
                categoryId: req.params.categoryId,
                publicStatus: true
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(201).send({
            success: true,
            message: "Subcategory fatched successfully",
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