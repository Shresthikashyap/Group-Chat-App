const Sequelize = require('sequelize');


<<<<<<< HEAD
const sequelize = new Sequelize( 'node-complete','root','1234shit',{
=======
const sequelize = new Sequelize( 'group-chat' , 'root' , 'user@12345678' ,{
>>>>>>> 76d2c29 (multiple groups)
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;