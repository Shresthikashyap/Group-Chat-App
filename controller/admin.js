const UserGroup = require('../model/UserGroup');
const User = require('../model/User');
const Group = require('../model/Group');
const jwt = require('jsonwebtoken')

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
        
        const admin = await Group.findOne({where:{id:groupId, userId:userId}});
        console.log(admin);

        const adminId = await Group.findOne({where:{id:groupId}});

        if (admin) {   
            res.status(200).json({ adminId, message: 'true' });
        } else {
            res.status(200).json({ adminId, message: 'false' });
        }
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

const changeAdmin = async(req,res) => {
    try{
        const { userId, groupId } = req.params;
        console.log('change admin',userId,groupId); 
        
        const user = await User.findByPk(userId);
        console.log(user.dataValues.name)
        const userName = user.dataValues.name;
        
        const group = await Group.findByPk(groupId);
        console.log(group.dataValues);

        const admin = await group.update({userId:userId, adminName:userName});
         
        res.status(200).json({admin, message: `changed successfully`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:`Something went wrong`})
    }
}

module.exports = {
    getMembers, checkAdmin, removeMember, changeAdmin
}