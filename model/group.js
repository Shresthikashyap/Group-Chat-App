const Sequelize = require('sequelize');

const sequelize = require('../../util/database');

const Group = sequelize.define('group',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    adminName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    groupName:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Group;