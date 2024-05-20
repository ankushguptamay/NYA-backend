module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define("subCategories", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        subCategoryName: {
            type: DataTypes.STRING
        },
        subCategoryImage_Path: {
            type: DataTypes.STRING(1234)
        },
        subCategoryImage_Originalname: {
            type: DataTypes.STRING
        },
        subCategoryImage_FileName: {
            type: DataTypes.STRING(1234)
        },
        subCategoryDescription: {
            type: DataTypes.STRING
        },
        cloudinaryFileId: {
            type: DataTypes.STRING
        },
        publicStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        paranoid: true
    });
    return SubCategory;
};

// categoryId