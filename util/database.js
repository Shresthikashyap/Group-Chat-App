const Sequelize = require('sequelize');

const sequelize = new Sequelize( 'group-chat' , 'adani' , 'adani_ki_aulaad' ,{
    dialect: 'mysql',
    host: 'database-1.cmcdzmkklrai.eu-north-1.rds.amazonaws.com'
});

module.exports = sequelize;