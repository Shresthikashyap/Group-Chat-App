const UserGroup = require('../model/UserGroup');
const User = require('../model/User');
const Group = require('../model/Group');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

const getMembers = async(req,res) =>  {
    try{
        console.log(req.body)
        const {groupId} = req.params;
        console.log('admin groupId ', groupId);

        const userIdList = await UserGroup.findAll({where:{groupId: groupId}});
       // console.log('groupList',userIdList);
     
        let memberList = [];
        for (let i = 0; i < userIdList.length; i++) {
            const item = userIdList[i];
            console.log('User ID:', item.dataValues.userId);
            let userId = item.dataValues.userId;
        
            if(userId !== null){  
                const user = await User.findByPk(userId); 
               // console.log(user) ;    
                memberList.push(user);
                //console.log('member list ***** ',memberList)
            } 
           // console.log(memberList);
        }

       // console.log('groupList',memberList);

        res.status(200).json({list:memberList});
    }
    catch(err){
        res.status(500).json({error:'Something went wrong'})
    }
}

const checkAdmin = async(req,res) => {
    try{
        const { userId, groupId} = req.params;
        console.log(userId, groupId);   
        
        const admin = await UserGroup.findOne({where:{userId:userId, groupId:groupId}});
        console.log('check admin',admin);

        //const adminId = await Group.findOne({where:{id:groupId}});


        res.status(200).json({admin});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:`Something went wrong`})
    }
}

const removeMember = async(req,res) => {
    try{
        const { userId , groupId} = req.params;
        console.log(userId, groupId);

        await UserGroup.destroy({where:{userId: userId, groupId: groupId}});

        res.status(200).json({message: `removed successfully`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:`Something went wrong`})
    }
}

const makeAdmin = async(req,res) => {
    try{
        const { userId, groupId } = req.params;
        console.log('change admin',userId,groupId); 
        
        //const user = await User.findByPk(userId);
        //console.log(user.dataValues.name)
        //const userName = user.dataValues.name;
        
       const usergroup = await UserGroup.findOne({where:{userId:userId,groupId:groupId}});
        //console.log(group.dataValues);

        const admin = await usergroup.update({isAdmin:true});
         
        res.status(200).json({admin, message: `successful`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:`Something went wrong`})
    }
}

const removeAdmin = async(req,res) => {
    try{
        const { userId, groupId } = req.params;
        console.log('change admin',userId,groupId); 
        
        //const user = await User.findByPk(userId);
        //console.log(user.dataValues.name)
        //const userName = user.dataValues.name;
        
       const usergroup = await UserGroup.findOne({where:{userId:userId,groupId:groupId}});
        //console.log(group.dataValues);

        const admin = await usergroup.update({isAdmin:false});
         
        res.status(200).json({admin, message: `successful`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:`Something went wrong`})
    }
}

const exitGroup = async(req,res) => {
    const t = await sequelize.transaction();
    try{
        const {userId} = req.params;
        const {groupId} = req.params;
        console.log(userId, groupId);

        await UserGroup.destroy({where:{groupId:groupId, userId: userId}},{trensaction:t});

        t.commit();
        res.status(200).json({message:`You are removed successfully`});
    }
    catch(err){
        console.log(err);
        t.rollback();
        res.status(500).json({error:`Something went wrong`}) ;     
    }
}

const deleteGroup = async(req,res) => {
    const t = await sequelize.transaction();
    try{
        const {groupId} = req.params;
        console.log(groupId);

        await UserGroup.destroy({where:{groupId:groupId}},{trensaction:t});
        await Group.destroy({where:{id:groupId}},{transaction:t});

        t.commit();
        res.status(200).json({message:`deleted successfully`});
    }
    catch(err){
        console.log(err);
        t.rollback();
        res.status(500).json({error:`Something went wrong`}) ;     
    }
}

module.exports = {
    getMembers, checkAdmin, removeMember, makeAdmin, removeAdmin, exitGroup, deleteGroup
}