module.exports = (sequelize, DataTypes) => {
    const Instructor = sequelize.define("instructor", {
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
        password: {
            type: DataTypes.STRING,
        },
        NYCCertificateNumber: {
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
    return Instructor;
};