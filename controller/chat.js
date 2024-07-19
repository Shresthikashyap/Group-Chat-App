const Message = require('../model/chat');
const sequelize = require('../../util/database');

const postGroupMessage = async(req,res) =>{
   
    try{      
     const { groupid } = req.params;
     const { id,name, message} = req.body; 

     console.log('message',message);
     console.log('group id',req.params);
     
     const messageDetails = await Message.create({message:message, memberName:name, userId:id, groupId: groupid});

     res.status(200).send({messageDetails});
    }
    catch(error){

      console.log(error);
     res.status(500).json({error:'!!! Something went wrong'});
    }
 }
 
 const getGroupMessage = async (req, res) => {
   
   
     try {  
 console.log('req params',req.params);
       //  const messages = await Message.findAll({ where: { id: { [Op.gte]: id }} });  
       const messages = await sequelize.query(`SELECT * FROM Messages WHERE id > ${req.params.lastmsgid} AND groupid = ${req.params.groupid}`,{ type: sequelize.QueryTypes.SELECT });  
       
     console.log('messages',messages);
       
       if (messages.length === 0) {
         res.status(200).json({ message: `No messages found` });
       } else {
        res.status(200).json({ message: messages });
       }
     } catch (error) {
      console.log(error)
       res.status(500).json({ error: '!!! Something went wrong' });
     }
}



module.exports = {
     postGroupMessage, getGroupMessage
}
