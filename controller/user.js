const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sequelize = require('../util/database');

exports.addUser = async(req, res) => {
  const t = await sequelize.transaction();
  try{
      const {name, email, password }= req.body;

      const hashedPassword = await bcrypt.hash(password, 10); 
      
      const newUser = await User.create({name: name, email: email, password: hashedPassword},{transaction: t});

      const payload = newUser.dataValues;
      const token = jwt.sign(payload,'mySecretKey')
      
      await t.commit();
      res.status(201).json({ token: token });
      
  }
  catch(err){
      await t.rollback();
       
      if (Error) {
          res.status(500).json({ error: 'User already exist' });
      } else {
          console.log(err);
          res.status(500).json({ error: 'Something went wrong' });
      }    
  }
}