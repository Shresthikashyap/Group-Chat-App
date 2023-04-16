const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sequelize = require('../util/database');

exports.addUser = async(req, res) => {
  const t = await sequelize.transaction();
  try{
      const {name, email, phonenumber, password }= req.body;


      const user = await User.findOne({ where: { phonenumber } },{transaction: t});
      if (user) {

        return res.status(404).json({ error: 'User already exists' });
      } 

     console.log(req.body)
      const hashedPassword = await bcrypt.hash(password, 10); 
      
      const newUser = await User.create({name: name, email: email,phone_number: phonenumber ,password: hashedPassword},{transaction: t});
      console.log(newUser.dataValues);
      const payload = newUser.dataValues;
      const token = jwt.sign(payload,'mySecretKey')
      
      await t.commit();
      res.status(201).json({ token: token ,message : 'Successfully signed up'});
      
  }
  catch(err){
      await t.rollback();
       
          console.log(err);
          res.status(500).json({ error: 'Something went wrong' });     
    }
}