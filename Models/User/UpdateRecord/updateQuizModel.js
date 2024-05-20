module.exports = (sequelize, DataTypes) => {
    const QuizUpdation = sequelize.define("quizUpdations", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        quizTitle: {
            type: DataTypes.STRING,
        },
        quizName: {
            type: DataTypes.STRING,
        },
        details: {
            type: DataTypes.STRING(1234),
        },
        question: {
            type: DataTypes.STRING(1234),
        },
        points: {
            type: DataTypes.STRING,
        },
        option: {
            type: DataTypes.JSON
        },
        answer: {
            type: DataTypes.STRING,
        },
        imagePath: {
            type: DataTypes.STRING(1234)
        },
        imageName: {
            type: DataTypes.STRING
        },
        imageFileName: {
            type: DataTypes.STRING
        },
        cloudinaryFileId: {
            type: DataTypes.STRING
        },
        createrId: {
            type: DataTypes.STRING
        },
        approvedByAdmin: {
            type: DataTypes.BOOLEAN
        }
    }, {
        paranoid: true
    });
    return QuizUpdation;
};

// quizId