const Sequelize = require('sequelize');

const sequelize = new Sequelize( 'group-chat' , 'root' , 'user@12345678' ,{
    dialect: 'mysql',
    host: '13.233.194.137'
});

module.exports = sequelize;