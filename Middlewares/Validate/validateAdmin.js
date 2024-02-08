const joi = require('joi');
const pattern = "/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/";

exports.adminRegistration = (data) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8),
        confirmPassword: joi.string().required()
    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

exports.adminLogin = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    })//.options({ allowUnknown: true });
    return schema.validate(data);
}

exports.validateCategory = (data) => {
    const schema = joi.object().keys({
        categoryName: joi.string().min(3).max(200).required()
    });
    return schema.validate(data);
}

exports.validateSubCategory = (data) => {
    const schema = joi.object().keys({
        subCategoryName: joi.string().min(3).max(200).required(),
        subCategoryDescription: joi.string().min(3).max(200).required(),
        categoryId: joi.string().required()
    });
    return schema.validate(data);
}

exports.validateAasana = (data) => {
    const schema = joi.object().keys({
        aasanaName: joi.string().min(3).max(200).required(),
        aasanaDescription: joi.string().min(3).max(1000).required(),
        aasanaTag: joi.string().min(3).max(200).required(),
        videoPath: joi.string().min(3).max(1000).required(),
        videoDuration: joi.string().min(3).max(200).required(),
        benefits: joi.string().min(3).max(1000).required(),
        instructions: joi.string().min(3).max(1000).required(),
        subCategoryId: joi.string().required(),
        categoryId: joi.string().required()
    });
    return schema.validate(data);
}

exports.validateCelebrity = (data) => {
    const schema = joi.object().keys({
        celebrityName: joi.string().required(),
        videoPath: joi.string().required()
    });
    return schema.validate(data);
}