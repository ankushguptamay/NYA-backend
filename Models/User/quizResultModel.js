module.exports = (sequelize, DataTypes) => {
    const QuizResult = sequelize.define("quizResults", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        attemptQuiz: {
            type: DataTypes.INTEGER,
        },
        rigthAnswer: {
            type: DataTypes.INTEGER,
        },
        wrongAnswer: {
            type: DataTypes.INTEGER,
        },
        skip: {
            type: DataTypes.INTEGER
        }
    });
    return QuizResult;
};