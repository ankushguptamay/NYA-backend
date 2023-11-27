module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("categories", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        categoryName: {
            type: DataTypes.STRING
        },
        categoryImage_Path: {
            type: DataTypes.STRING(1234)
        },
        categoryImage_Originalname: {
            type: DataTypes.STRING
        },
        categoryImage_FileName: {
            type: DataTypes.STRING(1234)
        },
        publicStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        paranoid: true
    });
    return Category;
};
