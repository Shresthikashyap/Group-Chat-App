const GroupFiles = require('../model/GroupFiles');
const Message = require('../model/Chat');
const S3Service = require('../services/S3services');

const downloadFiles = async(req,res) => {
    try{
      
      const {id,name,message} = req.body;
      console.log(message);
      const groupId = req.params.groupId;
   
      const stringifiedFiles = JSON.stringify(message);
  
     // const userId = req.user.id;
      const fileName = `${req.body.message}`; 
  
      console.log(stringifiedFiles,'********************');
      console.log(fileName,'****************************');
      const fileUrl = await S3Service.uploadToS3(stringifiedFiles, fileName);    
      
      console.log(fileUrl);
      await GroupFiles.create({url:fileUrl, groupId: groupId});
      const msg = await Message.create({message:fileUrl, memberName:name, userId:id, groupId:groupId});
  
      res.status(200).json({msg, success: true});
    }
    catch(err){
      res.status(500).json({fileUrl:'',success:false,err:err});
    }   
  }

const getAllFiles = async (req, res) => {
    try {
        
        const allFiles = await GroupFiles.findAll({where:{groupId:req.params.groupId}});
        //const urls = allDownloads.map(download => download.url);
        //console.log("all downloads====>>>",urls);

        res.status(200).json(allFiles);   
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error:'Something went wrong'});
    }
}

module.exports = {
    downloadFiles, getAllFiles
}