const express = require('express');
const bodyParser = require('body-parser'); 


const sequelize = require('./util/database');


const userRoutes = require('./routes/user');


var cors = require('cors');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin:"http://localhost:3000",
})); 

app.use(express.static('public'));
  
app.use('/users',userRoutes);

sequelize.sync()
.then(()=>{
    app.listen(3000,()=>{
        console.log('server is listening');
    })
})
.catch(err=>{
    console.log(err);
})