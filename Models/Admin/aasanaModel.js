module.exports = (sequelize, DataTypes) => {
    const Aasanas = sequelize.define("aasanas", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        aasanaName: {
            type: DataTypes.STRING
        },
        aasanaDescription: {
            type: DataTypes.STRING(1234)
        },
        aasanaTag: {
            type: DataTypes.STRING
        },
        videoPath: {
            type: DataTypes.STRING(1234)
        },
        videoDuration: {
            type: DataTypes.STRING
        },
        benefits: {
            type: DataTypes.STRING(1234)
        },
        instructions: {
            type: DataTypes.STRING(1234)
        },
        publicStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        paranoid: true
    });
    return Aasanas;
};

// categoryId
// subCategoryId