const errorHandler = require('../middlewares/errorMiddleware')
const userModel = require('../models/userModel')
const errorResponse = require('../utils/errorResponse')

exports.sendToken = async (user,statusCode,res)=>{
    const token = user.getSignedToken(res)
    res.status(statusCode).json({
        success: true,
        token
    })
}
exports.registerController = async (req,res,next)=>{
    try{
        const {username, email, password} = req.body;
        //check if user already registered
        const existingEmail = await userModel.findOne({email})
        if(existingEmail){
            return next(new errorResponse('Email already registered'))
        }
        const user = await userModel.create({username,email,password})
        this.sendToken(user,201,res)
    }
    catch(err){
        console.log(err)
        next(err)
    }
}
exports.loginController = async (req,res,next)=>{
    try{
       const {email, password} = req.body
       //validate email and password
       if(!email || !password){
        return next(new errorResponse('Please provide email or password'))
       }
       const user = await userModel.findOne({email})
       if(!user){
        return next(new errorResponse('Invalide credentials',404))
       }
       const isMatch = await user.matchPassword(password)
       if(!isMatch){
        return next(new errorResponse('Invalide credentials',401))
       }
       this.sendToken(user,200,res)
    }
    catch(error){
        console.log(error)
        next(error)
    }
}
exports.logoutController = async (req,res)=>{
   res.clearCookie('refresh Token')
   return res.status(200).json({
    success:true,
    message:'Logout Successfully'
   })
}