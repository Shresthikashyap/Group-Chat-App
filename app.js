const express = require('express');
const bodyParser = require('body-parser'); 
<<<<<<< HEAD

=======
>>>>>>> 76d2c29 (multiple groups)
const sequelize = require('./util/database');

const User = require('./model/user');
const Message = require('./model/chat');
<<<<<<< HEAD

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
=======
const Group = require('./model/group');

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');
>>>>>>> 76d2c29 (multiple groups)

var cors = require('cors');
const app = express();

<<<<<<< HEAD

=======
>>>>>>> 76d2c29 (multiple groups)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin:"http://localhost:3000",
})); 

app.use(express.static('public'));
  
app.use('/user',userRoutes);
app.use('/message',chatRoutes);
<<<<<<< HEAD

=======
app.use('/group',groupRoutes);

User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' });
>>>>>>> 76d2c29 (multiple groups)

User.hasMany(Message);
Message.belongsTo(User);

<<<<<<< HEAD
=======
Group.hasMany(Message);
Message.belongsTo(Group);

//User.hasMany(Group);

<<<<<<< HEAD
>>>>>>> 76d2c29 (multiple groups)
sequelize.sync()
=======
sequelize.sync({force:true})
>>>>>>> 7f433b4 (mutilpe groups)
.then(()=>{
    app.listen(3000,()=>{
        console.log('server is listening');
    })
})
.catch(err=>{
    console.log(err);
})