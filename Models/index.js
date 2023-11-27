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
db.admin = require('./Admin/admin.js')(sequelize, Sequelize);
db.aasana = require('./Admin/aasanaModel.js')(sequelize, Sequelize);
db.category = require('./Admin/categoryModel.js')(sequelize, Sequelize);
db.subCategory = require('./Admin/subCategoryModel.js')(sequelize, Sequelize);

// Admin Course Association
db.category.hasMany(db.subCategory, { foreignKey: "categoryId", as: "subCategories" });
db.subCategory.belongsTo(db.category, { foreignKey: "categoryId", as: "category" });

db.category.hasMany(db.aasana, { foreignKey: "categoryId", as: "aasanas" });
db.aasana.belongsTo(db.category, { foreignKey: "categoryId", as: "category" });

db.subCategory.hasMany(db.aasana, { foreignKey: "subCategoryId", as: "aasanas" });
db.aasana.belongsTo(db.subCategory, { foreignKey: "subCategoryId", as: "subCategory" });

module.exports = db;