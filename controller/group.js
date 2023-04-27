const Message = require('../model/chat');
const Group = require('../model/group')
const sequelize = require('../util/database');

const createGroup = async(req,res) =>{

   try{      
    console.log('new group ',req.body);
    console.log('user ki id',req.params)
    const userid = req.params.id;
    const { adminName, groupName} = req.body; 

    const newGroup= await Group.build({adminName: adminName, groupName: groupName, userId: userid});
    const newGroupDetails = await newGroup.save();

    res.status(200).send({newGroupDetails});
   }
   catch(error){
    console.log(error);
    res.status(500).json({error:'!!! Something went wrong'});
   }
}

const groupList = async(req,res) => {
    try{
        //const {id} = req.params;
        //console.log('User id for group list ',req.params)

        const groupList = await Group.findAll();

       // if(!groupList)

        res.status(200).json({list:groupList});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'Something went Wrong'});
    }
}

const getGroupList = async(req,res) => {
    try{
        const {id} = req.params;
        console.log('User id for group list ',req.params)

        const groupList = await sequelize.query(
            `SELECT * FROM Groups WHERE id IN (SELECT groupId FROM usergroup WHERE userId = ${id})`,
            { type: sequelize.QueryTypes.SELECT }
          );
                console.log('groupList',groupList)

        res.status(200).json({list:groupList});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'Something went Wrong'});
    }
}

module.exports = {
    createGroup, groupList, getGroupList
}