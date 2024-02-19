const dbConfig = require('../Config/db.config.js');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

const queryInterface = sequelize.getQueryInterface();

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Admin
db.emailCredential = require('./Admin/bravoEmailCredentialModel.js')(sequelize, Sequelize);
db.admin = require('./Admin/admin.js')(sequelize, Sequelize);
db.celebrity = require('./Admin/celebrityModel.js')(sequelize, Sequelize);
db.aasana = require('./Admin/aasanaModel.js')(sequelize, Sequelize);
db.category = require('./Admin/categoryModel.js')(sequelize, Sequelize);
db.subCategory = require('./Admin/subCategoryModel.js')(sequelize, Sequelize);

// User
db.forgetOTP = require('./User/forgetOTPModel.js')(sequelize, Sequelize);
db.user = require('./User/userModel.js')(sequelize, Sequelize);
db.quiz = require('./User/quizModel.js')(sequelize, Sequelize);
db.institute = require('./User/institutionModel.js')(sequelize, Sequelize);
db.instituteUpdation = require('./User/UpdateRecord/updateInstitutionModel.js')(sequelize, Sequelize);
db.instructorUpdation = require('./User/UpdateRecord/updateInstructorModel.js')(sequelize, Sequelize);
db.instructor = require('./User/instructorModel.js')(sequelize, Sequelize);
db.event = require('./User/eventModel.js')(sequelize, Sequelize);
db.eventUpdation = require('./User/UpdateRecord/updateEventModel.js')(sequelize, Sequelize);
db.updateQuiz = require('./User/UpdateRecord/updateQuizModel.js')(sequelize, Sequelize);
db.event_user = require('./User/event_userModel.js')(sequelize, Sequelize);

// Admin Course Association
db.category.hasMany(db.subCategory, { foreignKey: "categoryId", as: "subCategories" });
db.subCategory.belongsTo(db.category, { foreignKey: "categoryId", as: "category" });

db.category.hasMany(db.aasana, { foreignKey: "categoryId", as: "aasanas" });
db.aasana.belongsTo(db.category, { foreignKey: "categoryId", as: "category" });

db.subCategory.hasMany(db.aasana, { foreignKey: "subCategoryId", as: "aasanas" });
db.aasana.belongsTo(db.subCategory, { foreignKey: "subCategoryId", as: "subCategory" });

db.institute.hasMany(db.instituteUpdation, { foreignKey: "instituteId", as: "instituteUpdations" });
db.instituteUpdation.belongsTo(db.institute, { foreignKey: "instituteId", as: "institute" });

db.instructor.hasMany(db.instructorUpdation, { foreignKey: "instructorId", as: "instructorUpdations" });
db.instructorUpdation.belongsTo(db.instructor, { foreignKey: "instructorId", as: "instructor" });

db.event.hasMany(db.eventUpdation, { foreignKey: "eventId", as: "eventUpdations" });
db.eventUpdation.belongsTo(db.event, { foreignKey: "eventId", as: "event" });

db.quiz.hasMany(db.updateQuiz, { foreignKey: "quizId", as: "eventUpdations" });
db.updateQuiz.belongsTo(db.quiz, { foreignKey: "quizId", as: "event" });

// Event and event_user
db.event.hasMany(db.event_user, { foreignKey: "eventId", as: "event_user" });
db.event_user.belongsTo(db.event, { foreignKey: "eventId", as: "event" });

// user and event_user
db.user.hasMany(db.event_user, { foreignKey: "userId", as: "event_user" });
db.event_user.belongsTo(db.user, { foreignKey: "userId", as: "user" });

// db.emailCredential.findOne({
//     where: {
//         email: "morarjidesai19@gmail.com"
//     }
// }).then((res) => {
//     console.log(res);
//     if (!res) {
//         db.emailCredential.create({
//             email: "morarjidesai19@gmail.com",
//             plateForm: "BREVO",
//             EMAIL_API_KEY: process.env.EMAIL_API_KEY
//         });
//     }
// }).catch((err) => { console.log(err) });

queryInterface.changeColumn("quizs", "approvedByAdmin", { type: DataTypes.BOOLEAN }).then((res) => { console.log(res) }).catch((err) => { console.log(err) });
queryInterface.changeColumn("events", "approvedByAdmin", { type: DataTypes.BOOLEAN }).then((res) => { console.log(res) }).catch((err) => { console.log(err) });

module.exports = db;