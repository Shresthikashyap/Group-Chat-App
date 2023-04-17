const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = async(req,res,next) => {
    try{
        //console.log(req.headers)
       
        const token = await req.header('Authorization');
        
        const user =  jwt.verify(token,'mySecretKey',(err, decoded) => {
            if (err) {
              console.log(err);
            } else {
              return decoded;
            }
          });
        
        await User.findByPk(user.id).then((user)=>{
           req.user = user;
        
           next();
        })
    }
    catch(err){
      console.log('here')
        return res.status(401).json({success: false})
    }
}

module.exports = {
  authenticate
};