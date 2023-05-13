const Sequelize = require('sequelize');

const sequelize = new Sequelize( 'group-chat' , 'root' , 'user@12345678' ,{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;