module.exports = (sequelize, DataTypes) => {
    const Quiz_UserAnswer = sequelize.define("quiz_userAnswers", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        answer: {
            type: DataTypes.STRING
        },
        quizId:{
            type: DataTypes.STRING 
        },
        personId:{
            type: DataTypes.STRING
        }
    });
    return Quiz_UserAnswer;
};