const express = require('express');
const bodyParser = require('body-parser'); 
const sequelize = require('./util/database');

const User = require('./model/User');
const Message = require('./model/Chat');
const Group = require('./model/Group');
const UserGroup = require('./model/UserGroup');

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');

var cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin:"http://localhost:3000",
})); 

app.use(express.static('public'));
  
app.use('/user',userRoutes);
app.use('/message',chatRoutes);
app.use('/group',groupRoutes);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Group);

sequelize.sync()
.then(()=>{
    app.listen(3000,()=>{
        console.log('server is listening');
    })
})
.catch(err=>{
    console.log(err);
})