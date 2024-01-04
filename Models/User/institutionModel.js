module.exports = (sequelize, DataTypes) => {
    const Institute = sequelize.define("institute", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        centerName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        mobileNumber: {
            type: DataTypes.STRING,
        },
        seatingCapacity: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        approvedByAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        paranoid: true
    });
    return Institute;
};