module.exports = (sequelize, DataTypes) => {
    const Celebrity = sequelize.define("celebrities", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        celebrityName: {
            type: DataTypes.STRING
        },
        videoPath: {
            type: DataTypes.STRING(1234)
        }
    })
    return Celebrity;
}