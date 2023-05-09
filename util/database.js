const Sequelize = require('sequelize');

const sequelize = new Sequelize( 'group-chat' , 'admin' , '1234_Shit' ,{
    dialect: 'mysql',
    host: 'database-1.camqn9mzb50z.ap-south-1.rds.amazonaws.com'
});

module.exports = sequelize;