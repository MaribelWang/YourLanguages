const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    'db_yourlanguages', // 数据库名
    'root',             // 用户名
    '1234',             // 密码，作为字符串
    {
        host: 'localhost', // 数据库服务器地址
        dialect: 'mysql'   // 数据库方言（类型）
    }
);

module.exports = sequelize;
