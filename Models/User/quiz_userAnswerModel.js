module.exports = (sequelize, DataTypes) => {
    const Quiz_UserAnswer = sequelize.define("quiz_userAnwer", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        answer: {
            type: DataTypes.STRING,
        }
    });
    return Quiz_UserAnswer;
};