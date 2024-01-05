module.exports = (sequelize, DataTypes) => {
    const InstituteUpdation = sequelize.define("instituteUpdations", {
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
            type: DataTypes.BOOLEAN
        }
    }, {
        paranoid: true
    });
    return InstituteUpdation;
};

// InstituteId