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

exports.updateInstructor = (data) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        address: joi.string().required(),
        city: joi.string().required(),
        location: joi.string().required(),
        trainerAs: joi.string().valid("PUBLIC", "PRIVATE", "GOVERNMENT").required()

    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

exports.createQuiz = (data) => {
    const schema = joi.object().keys({
        quizName: joi.string().required(),
        details: joi.string().required(),
        points: joi.string().required(),
        question: joi.string().required(),
        option: joi.object().required(),
        answer: joi.string().required()

    });
    return schema.validate(data);
}

exports.createEvent = (data) => {
    const schema = joi.object().keys({
        date_time: joi.string().required(),
        eventName: joi.string().required(),
        location: joi.string().required(),
        aboutEvent: joi.string().required()

    });
    return schema.validate(data);
}

exports.sendOTP = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email')
    });
    return schema.validate(data);
}

exports.verifyOTP = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        otp: joi.string().length(6).required()
    });
    return schema.validate(data);
}

exports.generatePassword = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string()
        // .regex(RegExp(pattern))
        .required()
        .min(8),
        confirmPassword: joi.string()
        // .regex(RegExp(pattern))
        .required()
        .min(8)
    });
    return schema.validate(data);
}