const joi = require('joi');
const pattern = "/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/";

exports.registerUser = (data) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required()

    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

exports.loginUser = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    })//.options({ allowUnknown: true });
    return schema.validate(data);
}

exports.changePassword = (data) => {
    const schema = joi.object().keys({
        oldPassword: joi.string()
            .required()
            .min(8),
        newPassword: joi.string().min(8).required(),
    });
    return schema.validate(data);
}

exports.registerInstitute = (data) => {
    const schema = joi.object().keys({
        centerName: joi.string().required(),
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

exports.registerInstructor = (data) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8),
        NYCCertificateNumber: joi.string().required()
    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

exports.updateInstitute = (data) => {
    const schema = joi.object().keys({
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).optional(),
        address: joi.string().optional(),
        city: joi.string().optional(),
        location: joi.string().optional(),
        seatingCapacity: joi.string().optional()
    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

// exports.registerInstructor = (data) => {
//     const schema = joi.object().keys({
//         name: joi.string().required(),
//         email: joi.string().email().required().label('Email'),
//         password: joi.string()
//             // .regex(RegExp(pattern))
//             .required()
//             .min(8),
//         mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
//         address: joi.string().required(),
//         city: joi.string().required(),
//         location: joi.string().required(),
//         NYCCertificateNumber: joi.string().required(),
//         trainerAs: joi.string().required()

//     }) // .options({ allowUnknown: true });
//     return schema.validate(data);
// }