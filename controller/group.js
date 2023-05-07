const UserGroup = require('../model/UserGroup');
const Group = require('../model/Group')
const sequelize = require('../util/database');

const createGroup = async(req,res) =>{

   try{      
    console.log('new group ',req.body);
    console.log('user ki id',req.params)
    const userid = req.params.id;
    const { adminName, groupName} = req.body; 

    const newGroup= await Group.build({adminName: adminName, groupName: groupName});
    const newGroupDetails = await newGroup.save();

    await UserGroup.create({isAdmin:true,userId:req.params.id, groupId:newGroup.dataValues.id})

    res.status(200).send({newGroupDetails});
   }
   catch(error){
    console.log(error);
    res.status(500).json({error:'!!! Something went wrong'});
   }
}

// const getGroupList = async(req,res) => {
//     try{
//         //const {id} = req.params;
//         //console.log('User id for group list ',req.params)

//         const groupList = await Group.findAll();

//        // if(!groupList)

//         res.status(200).json({list:groupList});
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({error:'Something went Wrong'});
//     }
// }

const getUsersGroupList = async(req,res) => {
    try{
        const {id} = req.params;
        console.log('User id for group list ',req.params)

        const groupIdList = await UserGroup.findAll({where:{userId :id}});
        //console.log('groupList',groupIdList);

         
        let groupList = [];
        for (let i = 0; i < groupIdList.length; i++) {
            const item = groupIdList[i];
           // console.log('Group ID:', item.dataValues.groupId);
            let groupId = item.dataValues.groupId;
        
            if(groupId !== null){  
                const group = await Group.findByPk(groupId); 
                //console.log(group) ;    
                groupList.push(group);
                //console.log('group list ***** ',groupList)
            } 
            //console.log(groupList);
        }

        //console.log('groupList',groupList);
        res.status(200).json({list:groupList});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'Something went Wrong'});
    }
}

module.exports = {
    createGroup, getUsersGroupList
}