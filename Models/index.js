const dbConfig = require('../Config/db.config.js');

const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
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
db.quizUpdation = require('./User/UpdateRecord/updateQuizModel.js')(sequelize, Sequelize);
db.event_user = require('./User/event_userModel.js')(sequelize, Sequelize);
db.quiz_userAnswer = require('./User/quiz_userAnswerModel.js')(sequelize, Sequelize);
db.quizResult = require('./User/quizResultModel.js')(sequelize, Sequelize);

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

db.quiz.hasMany(db.quizUpdation, { foreignKey: "quizId", as: "eventUpdations" });
db.quizUpdation.belongsTo(db.quiz, { foreignKey: "quizId", as: "event" });

// Event and event_user
db.event.hasMany(db.event_user, { foreignKey: "eventId", as: "event_user" });
db.event_user.belongsTo(db.event, { foreignKey: "eventId", as: "event" });

// user and event_user
db.user.hasMany(db.event_user, { foreignKey: "userId", as: "event_user" });
db.event_user.belongsTo(db.user, { foreignKey: "userId", as: "user" });

db.emailCredential.findOne({
    where: {
        email: "morarjidesai19@gmail.com"
    }
}).then((res) => {
    console.log(res);
    if (!res) {
        db.emailCredential.create({
            email: "morarjidesai19@gmail.com",
            plateForm: "BREVO",
            EMAIL_API_KEY: process.env.EMAIL_API_KEY
        });
        console.log("EMAIL_CREDENTIALS")
    }
}).catch((err) => { console.log(err) });

BulkDataUpload = async () => {
    try {
        await sequelize.query(`INSERT INTO admins VALUES ('30671d60-608d-45ef-a5b5-52614a18aed0','Namaste Yoga App','namasteYogaApp@gmail.com','$2a$10$iBe/kqPU7QYqXECgnsZMGeL/N67p6SHILuUBLcM6x1XmAMHRwZmIW','2024-02-06 06:42:36','2024-02-06 06:42:36')`,
            {
                type: QueryTypes.INSERT
            });
        console.log("Admin");
        await sequelize.query(`INSERT INTO categories VALUES ('2a8ed76c-531a-4d82-9f5b-cc62925b4266','Yoga News','https://nya-file.s3.eu-north-1.amazonaws.com/1707209760309-nya.jpeg','nya.jpeg','1707209760309-nya.jpeg',0,'2024-02-06 08:56:01','2024-02-26 07:34:24',NULL),('33c79f82-cd41-474c-8d42-580243543c53','Yoga Trainers','https://nya-file.s3.eu-north-1.amazonaws.com/1707209744445-nya.jpeg','nya.jpeg','1707209744445-nya.jpeg',0,'2024-02-06 08:55:45','2024-02-26 07:34:25',NULL),('449e8cd2-1db9-4683-8a04-1056954e38c0','Yoga Events','https://nya-file.s3.eu-north-1.amazonaws.com/1707209598460-nya.jpeg','nya.jpeg','1707209598460-nya.jpeg',1,'2024-02-06 08:53:19','2024-02-06 09:00:17',NULL),('53736cae-2d8f-4fef-8d81-799721f539ba','Quiz','https://nya-file.s3.eu-north-1.amazonaws.com/1707209782625-nya.jpeg','nya.jpeg','1707209782625-nya.jpeg',0,'2024-02-06 08:56:23','2024-02-26 07:34:19',NULL),('5444148b-f458-45fe-bce1-f32c13a4255d','YCB','https://nya-file.s3.eu-north-1.amazonaws.com/1707209771522-nya.jpeg','nya.jpeg','1707209771522-nya.jpeg',0,'2024-02-06 08:56:12','2024-02-26 07:34:22',NULL),('6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','Common Yoga Protocol','https://nya-file.s3.eu-north-1.amazonaws.com/1707731006665-CYP.jpg','CYP.jpg','1707731006665-CYP.jpg',1,'2024-02-12 09:43:27','2024-02-12 14:42:14',NULL),('7bb3a4cd-b0bb-485b-b843-5c6897b3833d','Surya Namaskar','https://nya-file.s3.eu-north-1.amazonaws.com/1709200758460-surya.jpg','surya.jpg','1709200758460-surya.jpg',1,'2024-02-29 09:59:20','2024-02-29 10:02:43',NULL),('80fade2f-aa20-4d5d-b367-42cdcd818913','PM-Gallery','https://nya-file.s3.eu-north-1.amazonaws.com/1707209815010-nya.jpeg','nya.jpeg','1707209815010-nya.jpeg',1,'2024-02-06 08:56:55','2024-02-28 11:02:07',NULL),('925201dd-b646-42d1-83a7-9fd1cf5632de','Y-Break','https://nya-file.s3.eu-north-1.amazonaws.com/1707209800683-nya.jpeg','nya.jpeg','1707209800683-nya.jpeg',1,'2024-02-06 08:56:41','2024-02-28 11:11:21',NULL),
        ('adf8d585-b70a-421f-9569-ec04680dbe16','Yoga for Me','https://nya-file.s3.eu-north-1.amazonaws.com/1709200879207-yogaforme.jpg','yogaforme.jpg','1709200879207-yogaforme.jpg',1,'2024-02-29 10:01:20','2024-02-29 10:02:43',NULL),('b94f861d-34c6-4bae-9bb9-8a270961f296','Updating It','https://nya-file.s3.eu-north-1.amazonaws.com/1707203258359-Screenshot%20from%202024-02-01%2023-15-18.png','Screenshot from 2024-02-01 23-15-18.png','1707203258359-Screenshot from 2024-02-01 23-15-18.png',0,'2024-02-06 07:01:25','2024-02-06 07:07:40',NULL),('f1f06620-45c7-492d-a81b-b7f07457deaa','Yoga Centers','https://nya-file.s3.eu-north-1.amazonaws.com/1707209726534-nya.jpeg','nya.jpeg','1707209726534-nya.jpeg',0,'2024-02-06 08:55:27','2024-02-26 07:34:26',NULL),('f4d2ed09-fdf0-49ea-948f-217a3beefced','CYP Asanas','https://nya-file.s3.eu-north-1.amazonaws.com/1709200928269-asanas.jpg','asanas.jpg','1709200928269-asanas.jpg',1,'2024-02-29 10:02:09','2024-02-29 10:02:40',NULL)`,
            {
                type: QueryTypes.INSERT
            });
        console.log("CATEGORIES");
        await sequelize.query(`INSERT INTO celebrities VALUES ('02dc9e44-6fdc-4b78-a9ef-134da99095ec','MC Mary Kom','L0dPoe73Fk4','2024-03-18 05:00:54','2024-03-18 05:00:54'),('036063dd-d7a3-418b-8a82-9cfcec42219d','Anushka Sharma','X2njfl8GSA4','2024-03-18 05:05:47','2024-03-18 05:05:47'),('28a9e368-5a03-4627-82db-dc52fb8c6bb3','Akshay Kumar','8PeWaUGK6n0','2024-03-18 05:02:04','2024-03-18 05:02:04'),('28fa81fd-bb91-471d-9b20-57c81940220e','Hema Malini','QEGWWMbBSyk','2024-03-18 05:06:26','2024-03-18 05:06:26'),('32d89178-b299-413b-af46-2078b0cb376d','Virat Kohli','ooHfJcOV6KY','2024-03-18 05:01:46','2024-03-18 05:01:46'),('36aa4dec-6470-42eb-a5b3-1657205261e5','Anil Kapoor','ULYfXTvQRgw','2024-03-18 05:01:17','2024-03-18 05:01:17'),('5327711f-a707-424b-b783-5bab9475b125','Shailesh Lodha','t1hgXbnSy2A','2024-02-26 09:08:27','2024-02-26 09:08:27'),('5b163374-9e77-44ea-91c9-6c237af17ea3','Shivaji Satam','PSQcTGH3bxY','2024-02-26 09:07:52','2024-02-26 09:07:52'),('88e37d6e-a72d-4433-925e-1bd4f15a356a','Milind Soman','KkWvANEx1y0','2024-03-18 05:02:38','2024-03-18 05:02:38'),('b423632f-297e-4f6b-a6ad-31b436408d2f','Asha Bhosle','Zjy05yhCyd4','2024-03-18 05:00:12','2024-03-18 05:00:12'),('b4870614-a6fd-4c12-beaf-825f8a64973e','Sardar Singh','aGZwhHasaac','2024-03-18 05:00:35','2024-03-18 05:00:35'),('cacc6a3e-9545-4454-a75f-1ded66bca148','Amitabh Bachchan','PTy-SlZJSfE','2024-03-18 05:06:45','2024-03-18 05:06:45'),('d60d67ba-18fb-47fd-91fe-2b92fd962f56','Shilpa Shetty','7WRqf3xtnm4','2024-03-18 05:06:04','2024-03-18 05:06:04'),('fb1e84d9-874b-42c1-ada3-ddc663eb4127','Dilip Joshi','kE8UwQLsJpU','2024-02-26 09:07:29','2024-02-26 09:07:29')`,
            {
                type: QueryTypes.INSERT
            });
        console.log("celebrities");
        await sequelize.query(`INSERT INTO events VALUES ('9033904d-2f88-4aa7-be5b-355e880ae43b','2024-02-19 00:00:00','Test Event','Noida','for testing purpose','https://nya-file.s3.eu-north-1.amazonaws.com/1708328436854-service1.png','service1.png','1708328436854-service1.png',1,'6f9f47dc-059d-4481-b8e6-aad8e90ad394','2024-02-19 07:40:38','2024-02-26 05:56:06',NULL)`,
            {
                type: QueryTypes.INSERT
            });
        console.log("EVENTS");
        await sequelize.query(`INSERT INTO institutes VALUES ('292792eb-286d-4f37-92c5-119f20bdf8ea','Delhi','$2a$10$gu1z0/d1ICTv8zKS/OuxDe11NXgv3W8WxbjurptTozTJQyjaBX6E2','pallavisrivastava321@gmail.com',NULL,NULL,NULL,NULL,NULL,0,'2024-02-06 08:36:41','2024-02-06 08:36:41',NULL),('9b2d2909-f85a-46da-8642-e47890ca3e83','MDNIY','$2a$10$tIS4TBx7Ou.9ITnNesIlPuRiIe6NffHLgb6bVtmXoiUxAnQEc7Bd.','pallavi123@gmail.com',NULL,NULL,NULL,NULL,NULL,0,'2024-02-17 12:06:07','2024-02-17 12:06:07',NULL)`,
            {
                type: QueryTypes.INSERT
            });
        console.log("INSTITUTES");
        await sequelize.query(`INSERT INTO instructors VALUES ('0491bf5e-68a7-446e-bacd-603f0958b320','Pallavi','pallavi12@gmail.com',NULL,'$2a$10$xp8BOJsQO29RN7pCcP7FZOBFVmQeXoB7hIYsNFDlNGhhp3d5uM0f2','1',NULL,NULL,NULL,1,NULL,'2024-02-26 08:44:58','2024-02-26 08:47:25',NULL),('066fe3df-ad38-49f5-b67f-fd49aea98347','Priya','pallavi123@gmail.com',NULL,'$2a$10$Bm2o.YsJpcJGH5r8OrATJO.HarNE9tsuitMX3.AwmdjdqOxd2.lYK','9473666034',NULL,NULL,NULL,1,NULL,'2024-02-17 12:00:52','2024-02-19 07:05:24',NULL),('075dd694-3129-4122-8ae6-0accf9c364e4','Pallavi Srivastava','pallavisrivastava329@gmail.com',NULL,'$2a$10$nMei6gOTWDH9BPuJhqXbC.TZJaN0xK3Ul/dNDKJPpU3S4v8AmozB.','10',NULL,NULL,NULL,1,NULL,'2024-03-06 06:15:48','2024-03-06 06:40:44',NULL),('301862c4-008d-4c90-8a34-dcb390368b0f','Pallavi','pallavi@gmail.com',NULL,'$2a$10$M4gzyEmRw6HnsQ2kx5opf.zfigbN1Xa6RhiGUHXlSsVGM54wX1ZxG','123',NULL,NULL,NULL,0,NULL,'2024-02-17 11:49:36','2024-02-17 11:49:36',NULL),('6f9f47dc-059d-4481-b8e6-aad8e90ad394','Laxmi Gupta','guptalaxmi128@gmail.com',NULL,'$2a$10$e9uPqTL3ylIpKIzz0Qpw9eFP9HCFed36LYbbCgzh4lvstdBZpcBWS','12345',NULL,NULL,NULL,1,NULL,'2024-02-17 13:09:24','2024-02-19 07:39:10',NULL)`,
            {
                type: QueryTypes.INSERT
            });
        console.log("INSTRUCTOR");
        await sequelize.query(`INSERT INTO quiz_userAnswers VALUES ('4b95b616-d128-4003-8b1f-8786b84ba45a','d','008ec897-1b43-404f-8e43-e17eecd4c960','8ae779fb-8265-4463-904b-0ae376ec55c3','2024-03-10 04:43:57','2024-03-10 04:43:57'),('5a97992e-0d37-49a0-a5d9-dad15ec0ba04','optionA','286eb0ee-e9a8-4b79-b1b0-bf3de399d342','8ae779fb-8265-4463-904b-0ae376ec55c3','2024-03-11 06:05:21','2024-03-11 06:05:21'),('8ad459ce-7d4c-42a5-a1ea-751720e2c17b','a','6a59b5db-abcf-4cf0-a2e2-59808edf2bcc','8ae779fb-8265-4463-904b-0ae376ec55c3','2024-03-11 06:05:20','2024-03-11 06:05:20'),('9059ad6b-97cd-4a83-bb76-468c905296f8','d','4de7d7d5-6c75-4a04-b326-548dbdf5ba00','8ae779fb-8265-4463-904b-0ae376ec55c3','2024-03-10 04:43:56','2024-03-10 04:43:56'),('b029be00-4e6c-4eda-9903-2ab523376186','d','7903b074-450d-4f3e-ab56-8b7bedb614b5','8ae779fb-8265-4463-904b-0ae376ec55c3','2024-03-10 04:43:56','2024-03-10 04:43:56'),('d05dfcac-ecc1-4c8f-a531-0924874145c6','c','1bf8abe6-f762-4bdd-b159-782bff149e01','8ae779fb-8265-4463-904b-0ae376ec55c3','2024-03-10 15:42:20','2024-03-10 15:42:20')`,
            {
                type: QueryTypes.INSERT
            });
        console.log("QUIZ_USER_ANSWER");
        await sequelize.query(`INSERT INTO quizResults VALUES ('da9d72ba-0e6f-415a-a336-5e0d472b5d8e',6,0,6,0,'8ae779fb-8265-4463-904b-0ae376ec55c3','2024-03-11 12:55:22','2024-03-11 12:55:22')`,
            {
                type: QueryTypes.INSERT
            });
        console.log("QUIZ_RESULTS");
        await sequelize.query(`INSERT INTO quizs VALUES ('008ec897-1b43-404f-8e43-e17eecd4c960','Yoga Quiz','Yoga Quiz','Knowledge About Yoga','How many limbs of Ashtanga Yoga are there?','4','{\"a\": \"10\", \"b\": \"12\", \"c\": \"5\", \"d\": \"8\"}','8','https://nya-file.s3.eu-north-1.amazonaws.com/1709707277559-quiz1.jpeg','quiz1.jpeg','1709707277559-quiz1.jpeg','075dd694-3129-4122-8ae6-0accf9c364e4',1,'2024-03-06 06:41:18','2024-03-06 12:02:30',NULL),('1bf8abe6-f762-4bdd-b159-782bff149e01','YogaMohtsav Quiz','Yoga Quiz','Knowledge About Yoga','Pranayama is restraining of ','4','{\"a\": \"Prana\", \"b\": \"Mind\", \"c\": \"Respiration\", \"d\": \"None of the above\"}','Prana','https://nya-file.s3.eu-north-1.amazonaws.com/1709724131124-quiz1.jpeg','quiz1.jpeg','1709724131124-quiz1.jpeg','075dd694-3129-4122-8ae6-0accf9c364e4',1,'2024-03-06 11:22:12','2024-03-06 11:22:39',NULL),('286eb0ee-e9a8-4b79-b1b0-bf3de399d342',NULL,'Yoga Quiz','Yoga Quiz','Which language has the word “Yoga” originated from?','4','{\"optionA\": \"firstticket\"}','Sanskrit','https://nya-file.s3.eu-north-1.amazonaws.com/1708947827810-quiz.jpeg','quiz.jpeg','1708947827810-quiz.jpeg','0491bf5e-68a7-446e-bacd-603f0958b320',0,'2024-02-26 11:43:48','2024-03-12 07:30:14',NULL),
        ('4de7d7d5-6c75-4a04-b326-548dbdf5ba00','Yoga Quiz','Yoga Quiz','Knowledge About Yoga','What is the ideal time for Yogabhyas ?','4','{\"a\": \"Early morning\", \"b\": \"Evening \", \"c\": \"Afternoon \", \"d\": \"Midnight\"}','Early morning','https://nya-file.s3.eu-north-1.amazonaws.com/1709707535215-quiz1.jpeg','quiz1.jpeg','1709707535215-quiz1.jpeg','075dd694-3129-4122-8ae6-0accf9c364e4',1,'2024-03-06 06:45:36','2024-03-06 12:02:30',NULL),('6a59b5db-abcf-4cf0-a2e2-59808edf2bcc',NULL,'Yoga Quiz','Yoga Quiz','Which language has the word “Yoga” originated from?','4','{\"a\": \"Sanskrit\", \"b\": \"Hindi\", \"c\": \"English\", \"d\": \"Punjabi\"}','Sanskrit','https://nya-file.s3.eu-north-1.amazonaws.com/1709013250860-quiz1.jpeg','quiz1.jpeg','1709013250860-quiz1.jpeg','0491bf5e-68a7-446e-bacd-603f0958b320',0,'2024-02-27 05:54:12','2024-03-12 07:30:15',NULL),('7903b074-450d-4f3e-ab56-8b7bedb614b5','Yoga Quiz','Yoga Quiz','Knowledge About Yoga','What is “Raga” according to Yoga philosophy?','4','{\"a\": \"Klesha\", \"b\": \"Asakti\", \"c\": \"Prem\", \"d\": \"All of the above\"}','All of the above','https://nya-file.s3.eu-north-1.amazonaws.com/1709708083720-quiz1.jpeg','quiz1.jpeg','1709708083720-quiz1.jpeg','075dd694-3129-4122-8ae6-0accf9c364e4',1,'2024-03-06 06:54:44','2024-03-06 11:45:49',NULL)`,
            {
                type: QueryTypes.INSERT
            });
        console.log("QUIZS");
        await sequelize.query(`INSERT INTO subCategories VALUES ('32e5ef0f-3801-4a3f-9c56-0d93651a0831','Surya Namaskar','https://nya-file.s3.eu-north-1.amazonaws.com/1709264483187-surya.jpg','surya.jpg','1709264483187-surya.jpg','Surya Namaskar',0,'2024-03-01 03:41:24','2024-03-01 03:41:24',NULL,'7bb3a4cd-b0bb-485b-b843-5c6897b3833d'),('3d085eb8-51e1-4a22-912d-c3d982a2a025','CYP Asanas','https://nya-file.s3.eu-north-1.amazonaws.com/1709264454828-asaans.jpg','asaans.jpg','1709264454828-asaans.jpg','CYP Asanas',0,'2024-03-01 03:40:55','2024-03-01 03:40:55',NULL,'f4d2ed09-fdf0-49ea-948f-217a3beefced'),('4c48c8dd-fa52-4b72-a9e1-81aecd93f5e4','Yoga for Me','https://nya-file.s3.eu-north-1.amazonaws.com/1709264423666-yogafome.jpg','yogafome.jpg','1709264423666-yogafome.jpg','Yoga for Me',0,'2024-03-01 03:40:24','2024-03-01 03:40:24',NULL,'adf8d585-b70a-421f-9569-ec04680dbe16'),('4dd95cd4-6cb1-4aaa-875d-abf7f043ed1b','Y-Break','https://nya-file.s3.eu-north-1.amazonaws.com/1707733660637-ybreak.jpeg','ybreak.jpeg','1707733660637-ybreak.jpeg','Y-Break',1,'2024-02-12 10:27:41','2024-02-28 11:10:48',NULL,'925201dd-b646-42d1-83a7-9fd1cf5632de'),('51badd84-546e-4fed-9673-bf337e32001a','Common Yoga Protocol','https://nya-file.s3.eu-north-1.amazonaws.com/1707731096894-CYP.jpg','CYP.jpg','1707731096894-CYP.jpg','CYP',1,'2024-02-12 09:44:57','2024-02-15 11:31:52',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01'),('651a6aae-12e3-435d-b102-222bc6ec5520','Yoga with Modi','https://nya-file.s3.eu-north-1.amazonaws.com/1708172144439-1685595436.jpeg','1685595436.jpeg','1708172144439-1685595436.jpeg','Yoga with Modi',1,'2024-02-17 12:15:45','2024-02-28 11:02:22',NULL,'80fade2f-aa20-4d5d-b367-42cdcd818913')`,
            {
                type: QueryTypes.INSERT
            });
        console.log("SUBCATEGORIES");
        await sequelize.query(`INSERT INTO aasanas VALUES ('1267dbaa-3fae-4854-b682-4a04ff300c40','Common Yoga Protocol - Punjabi','Common Yoga Protocol','Common Yoga Protocol','LHiYorlONDI','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:16:54','2024-02-19 06:21:51',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('21ba2dc6-d80a-47dc-b6f3-e6be9f847d5a','Common Yoga Protocol - Malyalam','Common Yoga Protocol','Common Yoga Protocol','Lm3qCZPvru0','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:03:25','2024-02-19 11:28:49',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('292671fe-ee9a-48a7-b22d-64ac791af787','Common Yoga Protocol - Konkani','Common Yoga Protocol','Common Yoga Protocol','OXPJSP-7rHk','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:06:32','2024-02-19 11:32:24',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('35a9a2b5-9512-4a85-9535-376dde8170d7','Common Yoga Protocol - Maithili','Common Yoga Protocol','Common Yoga Protocol','WGD43Us5awM','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:04:06','2024-02-19 11:33:01',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('3664160c-a32d-4f28-9e15-175c4f46748b','Common Yoga Protocol - Sindhi','Common Yoga Protocol','Common Yoga Protocol','csXsJKj8hNk','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:11:04','2024-02-19 11:28:14',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('387988ad-8901-488b-8140-892af521d3f4','Common Yoga Protocol - Kannada','Common Yoga Protocol','Common Yoga Protocol','DvQQe7KiQiM','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:07:06','2024-02-19 11:31:11',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),
        ('62a1d648-f776-44a1-80d0-510d80e4e998','Common Yoga Protocol - Nepali','Common Yoga Protocol','Common Yoga Protocol','PmyzIgT-09I','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:18:15','2024-02-19 06:18:32',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('67c10967-aeec-48c7-838c-461789ecebb7','Common Yoga Protocol - Hindi','Common Yoga Protocol','Common Yoga Protocol','bEGJCJcWvMc','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 09:54:53','2024-02-12 09:54:53',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('693f4101-b106-4501-ad77-fd81182eaa4f','Kashmiri','Kashmiri','Yoga With Modi','OfQG11hzyE4','2:14','Yoga with Modi','Yoga with Modi',1,'2024-02-17 12:17:47','2024-02-17 12:18:06',NULL,'80fade2f-aa20-4d5d-b367-42cdcd818913','651a6aae-12e3-435d-b102-222bc6ec5520'),('6e49a458-ff5f-4dbb-879c-b5f2c1007908','Common Yoga Protocol - Odia','Common Yoga Protocol','Common Yoga Protocol','P4eX4V3jTkM','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:17:27','2024-02-19 06:21:07',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('77c81406-ccc0-43ed-9a86-ff4673c200f7','Common Yoga Protocol - Tamil','Common Yoga Protocol','Common Yoga Protocol','d5jKNjPfsHQ','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:10:21','2024-02-19 11:29:34',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('7ae5b50c-def7-46a5-b12e-79cfa8606ec7','Common Yoga Protocol - Gujarati','Common Yoga Protocol','Common Yoga Protocol','o0qN7SCBAec','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 10:08:15','2024-02-12 10:08:15',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('8f7a9667-9595-4cc9-b3d2-aabc7540b4fc','Common Yoga Protocol - Bengali','Common Yoga Protocol','Common Yoga Protocol','4u3hOC3oZGI','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 09:59:50','2024-02-12 09:59:50',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),
        ('902116b5-db54-420c-8372-805deb5185af','Common Yoga Protocol - Santhali','Common Yoga Protocol','Common Yoga Protocol','ZhEQ2NDSuM0','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:12:18','2024-02-19 06:19:52',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('9753e3b1-3d76-44bc-b9fa-6f6659c0c5ab','Common Yoga Protocol - Assamese','Common Yoga Protocol','Common Yoga Protocol','9xL9GYiST_g','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 09:56:05','2024-02-12 09:56:05',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('98891417-e2e0-45eb-96c3-3ce61aa8e9dd','Tadasana','Tadasana','Tadasana','xdHmXsNFDDY','0:15','Tadasana','Tadasana',0,'2024-03-01 03:43:06','2024-03-01 03:43:06',NULL,'f4d2ed09-fdf0-49ea-948f-217a3beefced','3d085eb8-51e1-4a22-912d-c3d982a2a025'),('af92d139-7410-44b9-91b0-8d772295a839','Common Yoga Protocol - Koshur','Common Yoga Protocol','Common Yoga Protocol','o9-bQZxdv9o','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 10:07:44','2024-02-19 07:04:29',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('b7055a24-e382-4342-ad1d-620af0d1e2db','Common Yoga Protocol - Manipuri','Common Yoga Protocol','Common Yoga Protocol','K8K-ttXFV30','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 10:02:46','2024-02-12 10:02:46',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('c2098932-c491-43f3-b941-96b18e8e27ee','Common Yoga Protocol - Bodo','Common Yoga Protocol','Common Yoga Protocol','JPNMSCcuw5c','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 10:00:37','2024-02-12 10:00:37',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('c251b77d-c0ce-497e-94ae-cdf4551a5ae0','Common Yoga Protocol - Urdu','Common Yoga Protocol','Common Yoga Protocol','YpU3NxOMvaA','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:09:17','2024-02-19 11:30:18',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),
        ('c3564150-9c8d-49d7-921f-f40b7123eead','Common Yoga Protocol - Dogri','Common Yoga Protocol','Common Yoga Protocol','i-FZNmoD6FU','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:08:48','2024-02-19 11:25:15',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('c3d0751e-40dd-4e21-a6d0-6218beeb8b83','Common Yoga Protocol - Marathi','Common Yoga Protocol','Common Yoga Protocol','kBZn6cW6fvY','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 10:02:00','2024-02-12 10:02:00',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('ccdd80f5-522b-4856-bcfc-88a90433df67','Yoga Break For Workaholics 1:','Yoga Break For Workaholics 1:','Yoga Break For Workaholics 1:','lqQQ3yUjnyM','5.00','Yoga Break For Workaholics 1:','Yoga Break For Workaholics 1:',1,'2024-02-12 10:30:14','2024-02-15 11:32:27',NULL,'925201dd-b646-42d1-83a7-9fd1cf5632de','4dd95cd4-6cb1-4aaa-875d-abf7f043ed1b'),('d3c9f02a-fa1c-42b2-aa11-a98b1f002e7b','Common Yoga Protocol - Telugu','Common Yoga Protocol','Common Yoga Protocol','ftIh2EfnHaI','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 10:01:22','2024-02-12 10:01:22',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('d992c166-a6f3-4fb4-915a-6f092f2c722b','Common Yoga Protocol - Sanskrit','Common Yoga Protocol','Common Yoga Protocol','y-DhkCQz9u0','46:52','Common Yoga Protocol','Common Yoga Protocol',1,'2024-02-12 10:13:19','2024-02-19 06:19:10',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),('daf1282f-f94f-4698-a7e5-615d0f8f8123','Common Yoga Protocol - English','Common Yoga Protocol','Common Yoga Protocol','VjbAyThDITc','46:52','Common Yoga Protocol','Common Yoga Protocol',0,'2024-02-12 09:51:41','2024-02-12 09:51:41',NULL,'6a7011fe-89e3-4855-9a8c-aee5b2a4bd01','51badd84-546e-4fed-9673-bf337e32001a'),
        ('ee76cc27-c4d9-48a5-8581-1d6e1a4d004f','Y Break @ Workplace Yoga  at Chair','Y Break @ Workplace Yoga  at Chair','Y Break @ Workplace Yoga  At Chair','lqQQ3yUjnyM','5.00','Y Break @ Workplace Yoga  at Chair','Y Break @ Workplace Yoga  at Chair',1,'2024-02-12 10:28:46','2024-02-15 11:32:30',NULL,'925201dd-b646-42d1-83a7-9fd1cf5632de','4dd95cd4-6cb1-4aaa-875d-abf7f043ed1b'),('f043a941-b57d-4080-8191-2e4d0d0fd93a','Yoga Break For Workaholics 2:','Yoga Break For Workaholics 2:','Yoga Break For Workaholics 2:','aqYJR8HnSJI','5.00','Yoga Break For Workaholics 2:','Yoga Break For Workaholics 2:',1,'2024-02-12 10:31:20','2024-02-15 11:32:20',NULL,'925201dd-b646-42d1-83a7-9fd1cf5632de','4dd95cd4-6cb1-4aaa-875d-abf7f043ed1b'),('faa0e249-a9c8-412e-9392-9d52600227f3','Yoga Break :','Yoga Break :','Yoga Break :','I8YBnxWjHbg','5.00','Yoga Break :','Yoga Break :',1,'2024-02-12 10:31:52','2024-02-15 11:32:18',NULL,'925201dd-b646-42d1-83a7-9fd1cf5632de','4dd95cd4-6cb1-4aaa-875d-abf7f043ed1b')`,
            {
                type: QueryTypes.INSERT
            });
        console.log("AASANAS");
        await sequelize.query(`INSERT INTO users VALUES ('2a607faf-003f-4606-ae22-9355ea007821','Pallavi','pallavi321@gmail.com','9473666923','$2a$10$kJSlly06fMKR.TSwl.36zel3PfzuFy06D0xUVd63LBbcy5Ttq3jue','2024-02-19 11:55:54','2024-02-19 11:55:54',NULL),('2f7c5710-4c41-40cd-af24-bc8600d46931','asa','as@gmail.com','2342345435','$2a$10$gSE.ttkBi4sRz9FL64FHUeeHK9yXdNaHWmN0xX7qkNfJFOJ5AS.Ne','2024-03-21 08:17:01','2024-03-21 08:17:01',NULL),('368e3dee-75b9-4d46-9155-2fe658201d68','asa','as@gmail.com','2342345435','$2a$10$KJkrb3MpR6PJjxCndPYbiOKp1zyoMuKjPFXzbcwupq.OqAT1eSGBW','2024-03-21 08:17:00','2024-03-21 08:17:00',NULL),('559e9fde-119d-4fb0-b07c-2b096af671cf','asa','as@gmail.com','2342345435','$2a$10$NC/gloiZrE699A05bWDf1.RLGWNVB3wi1GKt5B74G4Vn.ONZErG6G','2024-03-21 08:17:01','2024-03-21 08:17:01',NULL),('8ae779fb-8265-4463-904b-0ae376ec55c3','Fjfj','pallavisrivastava321@gmail.com','9473666934','$2a$10$tu/P.9YoVQeMscH.xoy6tOQPT4OAn6QHaGpcWF55Pf5OaVJLe1xJK','2024-02-17 11:41:33','2024-02-17 11:41:33',NULL),('a9a375ba-2667-44cd-988e-23f1fedc1527','Pallavi','pallavi@gmail.com','9473666934','$2a$10$46QD/W3fWPkp1ZJGwfKuXeeP1QAa02Qr1I1gRQgpbzkVPdua8yP7K','2024-02-17 11:40:16','2024-02-17 11:40:16',NULL),('c5497baa-929a-4036-a996-47f65a8c0506','asa','as@gmail.com','2342345435','$2a$10$L1r75IkcxfP0OLN.wuagVuTNyt1StbVMmvUwYLccl9gR98gwtTJs.','2024-03-21 08:17:01','2024-03-21 08:17:01',NULL),('e64c6e87-0ea0-4cb1-b091-f4fccfc6a1d2','Priya','pallavi123@gmail.com','9473666034','$2a$10$4Ir9pa8v6aDcF82gdpi7De9sJ5XJI5WV7i8Z.dAyhe2J213oSGO6y','2024-02-17 11:59:27','2024-02-17 11:59:27',NULL)`,
            {
                type: QueryTypes.INSERT
            });
        console.log("USER");
    } catch (err) {
        console.log(err.message);
    }
}

db.admin.findOne({
    where: {
        email: "namasteYogaApp@gmail.com"
    }
}).then((res) => {
    console.log(res);
    if (!res) {
        BulkDataUpload();
    }
}).catch((err) => { console.log(err) });

module.exports = db;