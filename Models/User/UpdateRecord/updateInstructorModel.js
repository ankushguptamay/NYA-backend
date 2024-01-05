module.exports = (sequelize, DataTypes) => {
    const InstructorUpdation = sequelize.define("instructorUpdations", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        mobileNumber: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        },
        NYCCertificateNumber: {
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
        },
        trainerAs: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['PUBLIC', 'PRIVATE', 'GOVERNMENT']]
            }
        }
    }, {
        paranoid: true
    });
    return InstructorUpdation;
};

// InstructorId