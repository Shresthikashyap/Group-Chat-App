const express = require('express');
const bodyParser = require('body-parser'); 
const sequelize = require('./util/database');
const http = require('http');
const socketio = require('socket.io');
const cron = require('node-cron');

const User = require('./model/User');
const Message = require('./model/Chat');
const Group = require('./model/Group');
const UserGroup = require('./model/UserGroup');
const GroupFiles = require('./model/GroupFiles');
const ArchievedMessage = require('./model/ArchievedChat');

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');
const adminRoutes = require('./routes/admin');
const fileRoutes = require('./routes/group-files');

//var cors = require('cors'); 
const app = express();
const server = http.createServer(app);   // create a server instance
const io = socketio(server);         // initialize socket.io
const multer = require('multer');
const upload = multer();

require('dotenv').config({ path: './.env' });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.use(cors({
//     origin:"http://16.170.219.218",
// })); 

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

User.hasMany(ArchievedMessage);
Group.hasMany(ArchievedMessage);

sequelize.sync()
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

    cron.schedule('0 0 * * *', async () => {
        try {
            
            const chats = await Message.findAll();
            console.log('chats *********',chats);

            for (const chat of chats) {
                await ArchievedMessage.create({ groupId: chat.groupId, userId: chat.userId, message: chat.message });
                console.log('id hai yaar',chat.id)
                await Message.destroy({where:{id:chat.id}})
            }

            console.log('Running cron job...');
        } catch (error) {
            console.error('Error occurred while processing chats:', error);
        }
    });
})
.catch(err=>{
    console.log(err);
})