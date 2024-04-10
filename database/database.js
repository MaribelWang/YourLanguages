const { Sequelize } = require ("sequelize");

const sequelize = new Sequelize(
    'DB_yourlanguages',
    'root', 1234, {
        host: 'localhost',
        dialect: "mysql"
})

module.exports = sequelize