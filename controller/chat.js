const UserGroup = require('../model/UserGroup');
const Message = require('../model/Chat');
const sequelize = require('../util/database')

const postGroupMessage = async(req,res) =>{
   // const t = await sequelize.transaction();
    try{      
     const { groupid } = req.params;
     const { id,name, message} = req.body; 
     console.log(req.body);
     console.log('group id',req.params);
 
     const messageDetails = await Message.create({message:message, memberName:name, userId:id, groupId: groupid});
     const userGroup = await UserGroup.create({userId: id, groupId:groupid});

          console.log('usergroup ********** ',userGroup);

    // await t.commit();
     res.status(200).send({messageDetails});
    }
    catch(error){
      //await t.rollback();
     res.status(500).json({error:'!!! Something went wrong'});
    }
 }
 
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
     postGroupMessage, getGroupMessage
}