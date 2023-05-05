const GroupFiles = require('../model/GroupFiles');
const S3Service = require('../services/S3services');

const downloadFiles = async(req,res) => {
    try{
      
      
      const groupId = req.params.groupId;
      const file = req.body.fileUrl;
   
      const stringifiedFiles = JSON.stringify(file);
  
     // const userId = req.user.id;
      const fileName = `${req.body.fileName}`; 
  
      console.log(stringifiedFiles,'*******************')
      console.log(fileName,'****************************')
      const fileUrl = await S3Service.uploadToS3(stringifiedFiles, fileName);    
      
      console.log(fileUrl);
      const groupFile = await GroupFiles.create({url:fileName, groupId: groupId});
  
      res.status(200).json({fileName, success: true});
    }
    catch(err){
      res.status(500).json({fileUrl:'',success:false,err:err})
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