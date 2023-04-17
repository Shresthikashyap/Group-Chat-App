const express = require('express');
const bodyParser = require('body-parser'); 

const sequelize = require('./util/database');

const User = require('./model/user');
const Message = require('./model/chat');

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

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

User.hasMany(Message);
Message.belongsTo(User);

sequelize.sync()
.then(()=>{
    app.listen(3000,()=>{
        console.log('server is listening');
    })
})
.catch(err=>{
    console.log(err);
})