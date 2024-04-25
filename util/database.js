const Sequelize = require('sequelize');

const sequelize = new Sequelize( 'group-chat','root','user@1234567',{//process.env.DB_NAME , process.env.DB_USERNAME , process.env.DB_PASSWORD ,{
    dialect: 'mysql',
    host: '3.27.43.97'//process.env.DB_HOST
});

module.exports = sequelize;