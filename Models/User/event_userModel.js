module.exports = (sequelize, DataTypes) => {
    const Event_User = sequelize.define("event_users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        isAttend: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        paranoid: true
    });
    return Event_User;
};