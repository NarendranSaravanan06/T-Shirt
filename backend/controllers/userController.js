const User=require('../models/User')
const jwt =require('jsonwebtoken')
 const CustomError = require('../middlewares/customError')


const getUsers = async (req, res, next) => {
    try {
        const user=  await User.find()
        if (!user)
            next(new CustomError('user not available', 404))
        res.status(200).json(user)
    } catch (error) {
        next(new CustomError(error, 500))
    }
}


const getUserById = async (req, res, next) => {
    const userId=req.params.id
    try {
        const {email,username,name,profile} = await User.findOne({userId});
        const users={email,username,name,profile}
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json('error');
        // next(new CustomError(error.message, 500));
    }
};

const updateUser=async (req,res,next)=>{
    try{
        const userDetail=req.body.user
        const updateDetail=req.body.update

        const result=await User.findOneAndUpdate(userDetail,updateDetail,{new:true})
        if(!result)
        next(new CustomError (`cannot update... doesnt exist`,400))
        else
        res.status(200).json('success')    
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}


module.exports={getUserById,getUsers,updateUser}