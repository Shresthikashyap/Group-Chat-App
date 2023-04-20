const User = require('../model/user');
const Message = require('../model/chat');
const sequelize = require('../util/database')

const postMessage = async(req,res) =>{

   try{      

    const { name, message} = req.body; 
    console.log(req.body.id);

    const messageDetails = await Message.create({message:message, memberName:name, userId:req.body.id});

    res.status(200).send({messageDetails});
   }
   catch(error){
    res.status(500).json({error:'!!! Something went wrong'});
   }
}

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
    postMessage, getMessages, getMessage
}