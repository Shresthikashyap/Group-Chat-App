const express = require('express');
const bodyParser = require('body-parser'); 
const sequelize = require('./util/database');
const http = require('http');
const socketio = require('socket.io');

const User = require('./model/User');
const Message = require('./model/Chat');
const Group = require('./model/Group');
const UserGroup = require('./model/UserGroup');
const GroupFiles = require('./model/GroupFiles');

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');
const adminRoutes = require('./routes/admin');
const fileRoutes = require('./routes/group-files');

var cors = require('cors');
const app = express();
const server = http.createServer(app);   // create a server instance
const io = socketio(server);         // initialize socket.io
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin:"http://localhost:3000",
})); 

app.use(express.static('public'));
  
app.use('/user',userRoutes);
app.use('/message',chatRoutes);
app.use('/group',groupRoutes);
app.use('/admin',adminRoutes);
app.use('/file', upload.single('myfile'),fileRoutes);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

Group.hasMany(GroupFiles);

sequelize.sync({force:true})
.then(()=>{
    server.listen(3000,()=>{
        console.log('server is listening');
    })

    io.on('connection',(socket) => {
        console.log('user connected');

        socket.on('joinRoom', (groupId) => {
            console.log('joining room:', groupId);
            socket.join(groupId);
        });
        
        socket.on('message', (msg) => {

            console.log('groupId :', msg.groupId);
            console.log('Received message:', msg.message);
            io.to(msg.groupId).emit('receivedMsg', msg);
        });
        
        socket.on('disconnect',()=>{
            console.log('user disconnected');
        });
    })
})
.catch(err=>{
    console.log(err);
})