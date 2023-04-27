const User = require('../model/user');
const Message = require('../model/chat');
const sequelize = require('../util/database')

const postMessage = async(req,res) =>{

   try{      
<<<<<<< HEAD

    const { name, message} = req.body; 
    console.log(req.body.id);
=======
  
    const { name, message} = req.body; 
    console.log(req.body);
>>>>>>> 76d2c29 (multiple groups)

    const messageDetails = await Message.create({message:message, memberName:name, userId:req.body.id});

    res.status(200).send({messageDetails});
   }
   catch(error){
    res.status(500).json({error:'!!! Something went wrong'});
   }
}

<<<<<<< HEAD
const getMessages = async(req,res) => {
    try{      

        const messages = await Message.findAll();

        res.status(200).json({messages});
       }
       catch(error){
        res.status(500).json({error:'!!! Something went wrong'});
       }
}

const getMessage = async (req, res) => {
    const { id } = req.params;
  
    try {  
        console.log('id ',id);  

      //  const messages = await Message.findAll({ where: { id: { [Op.gte]: id }} });  
      const messages = await sequelize.query(`SELECT * FROM Messages WHERE id > ${id}`,{ type: sequelize.QueryTypes.SELECT });  
=======
// const getMessages = async(req,res) => {
//     try{      
     
//         const messages = await Message.findAll();

//         res.status(200).json({messages});
//        }
//        catch(error){
//         res.status(500).json({error:'!!! Something went wrong'});
//        }
// }

const getMessage = async (req, res) => {
  console.log('req params',req.params);
  
    try {  

      //  const messages = await Message.findAll({ where: { id: { [Op.gte]: id }} });  
      const messages = await sequelize.query(`SELECT * FROM Messages WHERE id > ${req.params.lastmsgid} AND groupId IS NULL`,{ type: sequelize.QueryTypes.SELECT });  
>>>>>>> 76d2c29 (multiple groups)
      
      console.log('messages',messages);
      
      if (messages.length === 0) {
        res.status(200).json({ message: `No messages found` });
      } else {
       res.status(200).json({ message: messages });
      }
    } catch (error) {
      res.status(500).json({ error: '!!! Something went wrong' });
    }
  }
<<<<<<< HEAD
  
module.exports = {
    postMessage, getMessages, getMessage
=======

  const postGroupMessage = async(req,res) =>{

    try{      
     const { groupid } = req.params;
     const { name, message} = req.body; 
     console.log(req.body);
     console.log('group id',req.params)
 
     const messageDetails = await Message.create({message:message, memberName:name, userId:req.body.id, groupId: groupid });
 
     res.status(200).send({messageDetails});
    }
    catch(error){
     res.status(500).json({error:'!!! Something went wrong'});
    }
 }
 
//  const getGroupMessages = async(req,res) => {
//      try{      
//          const groupid = req.params.id;
//          const messages = await Message.findAll({where:{groupId:groupid}});
 
//          res.status(200).json({messages});
//         }
//         catch(error){
//          res.status(500).json({error:'!!! Something went wrong'});
//         }
//  }
 
 const getGroupMessage = async (req, res) => {
   console.log('req params',req.params);
   
     try {  
 
       //  const messages = await Message.findAll({ where: { id: { [Op.gte]: id }} });  
       const messages = await sequelize.query(`SELECT * FROM Messages WHERE id > ${req.params.lastmsgid} AND groupid = ${req.params.groupid}`,{ type: sequelize.QueryTypes.SELECT });  
       
       console.log('messages',messages);
       
       if (messages.length === 0) {
         res.status(200).json({ message: `No messages found` });
       } else {
        res.status(200).json({ message: messages });
       }
     } catch (error) {
       res.status(500).json({ error: '!!! Something went wrong' });
     }
   }
  
module.exports = {
    postMessage,  getMessage, postGroupMessage, getGroupMessage
>>>>>>> 76d2c29 (multiple groups)
}