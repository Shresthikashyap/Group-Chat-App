const UserGroup = require('../model/UserGroup');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sequelize = require('../util/database');

exports.addUser = async(req, res) => {
  const t = await sequelize.transaction();
  try{
      console.log('req ***********',req.query);
      const { groupId } = req.query;
      const {name, email, phonenumber, password }= req.body;

      if(name === 'undefined' || email === 'undefined' || phonenumber === 'undefined' || password=== 'undefined'){
        res.status(500).json({error:"Something went wrong"})
      }
      const user = await User.findOne({ where: { email } },{transaction: t});

      if (user) {
        return res.status(404).json({ error: 'User already exists' });
      } 

     console.log(req.body)
      const hashedPassword = await bcrypt.hash(password, 10); 
      
      const newUser = await User.create({name: name, email: email,phone_number: phonenumber ,password: hashedPassword},{transaction: t});
      console.log('*******new user',newUser.dataValues.id)
      if(groupId !== 'undefined'){
         await UserGroup.create({userId: newUser.dataValues.id, groupId: groupId},{transaction: t})
      }

      console.log(newUser.dataValues);
      const payload = newUser.dataValues;
      const token = jwt.sign(payload,'mySecretKey')
      
      await t.commit();
      res.status(201).json({name: name, token: token });
      
  }
  catch(err){
      await t.rollback();
       
          console.log(err);
          res.status(500).json({ error: 'Something went wrong' });     
    }
}

exports.getLogin = async(req,res) => {
  const t = await sequelize.transaction();

  try{
    console.log('req ***********',req.query);
    const { groupId } = req.query;

    const {email, password} = req.body;

    if (email==='undefined' || password === 'undefined') {
      return res.status(500).json({ error: 'User not found' });
    }

    const user  = await User.findOne({where:{email},transaction:t})
    //console.log('user id', user)
    if(!user) { return res.status(404).json({error:'User not found'})}

    if(groupId !== 'undefined' ) {
      console.log(user.dataValues.id, groupId)
      await UserGroup.create({userId: user.dataValues.id, groupId: groupId})
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
      return res.status(401).json({error: 'User not authorized'});
    }

    const payload = user.dataValues;
    const token = jwt.sign(payload,'mySecretKey')
    
    await t.commit();
    res.status(200).json({token:token})
  }
  catch(err){
       console.log(err);
       await t.rollback();
       res.status(500).json({error:'Something went wrong'});
  }
}