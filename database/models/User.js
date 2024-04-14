const {DataTypes} = require('sequelize')
const sequelize = require('../database')

const User = sequelize.define('Users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING
    },
    hashedPassword: {
        type: DataTypes.STRING
    },
    imagePath: {
        type: DataTypes.STRING
    },
    languageRequired: {
        type: DataTypes.STRING
    },
    pricePreferred: {
        type:DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING
    }
},{
    //Here can add aditional config like
    //timestamps: false
})

module.exports = User;