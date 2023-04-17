const User = require('../model/user');
const Message = require('../model/chat');

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

        const message = await Message.findAll();
    
        res.status(200).send({message});
       }
       catch(error){
        res.status(500).json({error:'!!! Something went wrong'});
       }
}

module.exports = {
    postMessage, getMessages
}