var jwt = require('jsonwebtoken');
const userCollection=require('../models/UsersSchema')
const bcrypt=require('bcryptjs');
var salt=bcrypt.genSaltSync(10);
let JWT_SECRET="hellBoy"
const crypto=require('crypto');
const nodemailer=require("nodemailer");



const createUser=async(req,res)=>{
   const {name,email,password}=req.body;
   if(!name){
    return res.json({msg:"name is required",success:false})
   }
   if(!email){
    return res.json({msg:"email is required",success:false})
   }
   if(!password){
    return res.json({msg:"password is required",success:false})
   }

   let existingUser=await userCollection.findOne({email});
   if(existingUser){
    return res.json({msg:"user already registerd",success:false})
   }
   try{

    let hashedPassword=bcrypt.hashSync(password,salt)

    let data=await  userCollection.create({
    name:name,
    email:email,
    password:hashedPassword

    })

    res.json({msg:"user created seccessfully",success:true,data})
   }
   catch(error) {
    res.json({msg:"error in creating user ",success:false,error:error.message})
   }
}

const updateUser=async(req,res)=>{
   
    const {name,password} =req.body;
    let _id =req.user._id;

    try{
        let hashedPassword;
        if(password){
            hashedPassword=bcrypt.hashSync(password,salt)
        }
        let data=await userCollection.findByIdAndUpdate(_id ,{$set:{name:name,password:hashedPassword}})

        res.json({masg:"user updated successfully",success:true})
    }
    catch(error){
        res.json({msg:"error in updating user",success:false,error:error.message})
    }



}
const getUserDetails=async(req,res)=>{
   let userId=req.user._id

   try{
    let user=await userCollection.findById(userId)
    if(user){
  return res.json({msg:"user fetched successfully",success:true,user})
    }
    else{
      return res.json({msg:"user not found",success:false})
     }
   }catch(error){
  res.json({msg:"error in getting user details",success:false,error:error.message })
   }
  
}

const loginUser= async(req,res)=>{
    const {email, password} = req.body;

  try {
    let existingData = await userCollection.findOne({email});
    console.log(existingData)

    if(existingData){
        let comparePassword = bcrypt.compareSync(password, existingData.password);
        if(comparePassword){

         let token=jwt.sign({_id:existingData._id},JWT_SECRET)  
            return res.json({msg:"user login successfully",success:true,token:token})
        }else{
            return res.json({msg:"invalid password",success:false})
        }

    }
    else{
        return res.json({msg:"user not found please signup",success:false})
    }
  } catch (error) {
    res.json({msg:"error in log in user",success:false,error:error.message})
  }
}

const deleteUser=async(req,res)=>{
  let id =req.params._id

  //  console.log("paramsid=",id)
  //  console.log("userLoggedin id=",re.user._id)

  if(req.user._id!==id){
    return
    res.json({msg:"authentication failed !"})
  }
try{
    let data=await userCollection.findByIdAndDelete(id)
    res.json({msg:"user deleted successfully",success:true})
}
catch (error) {
  res.json({msg:"error in deleting user",success:false,error:error.message})
}
}
function generateToken(){

  return crypto.randomBytes(20).toString('hex')
  
}

const forgetPassword=async(req,res)=>{
  const{email}=req.body;
  let user=await userCollection.findOne({email})
  console.log(user)

  if(user){
    let resetToken = await generateToken();
    await userCollection.updateOne({_id:user._id},{$set:{resetToken:resetToken}})
    sendResetEmail(user.email,resetToken)
   
    res.json({msg:"check your email for password reset link",success:true,resetToken})
}
else{
    return res.json({msg:"user not found",success:false})
}
}

async function sendResetEmail(email,token){
  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "agnihotrisatyam483@gmail.com",
        pass: "xmhi gkxj bhxl eqhk",
      },
    });
    const mailOption={
      from:'agnihotrisatyam483@gmail.com',
      to:email,
      subject:'password reset request',
      text:`Hello Please click the link below to choose a new password :,\n http://localhost:8080/users/reset-password/${token}`
    }
    transporter.sendMail(mailOption,(error,info)=>{
      if(error){
          console.log(error)
      }
      else{
          console.log('email sent successfully ')
      }
    })
}

const getToken=async(req,res)=>{
  let{token}=req.params;
  if(!token){
    return  res.json({msg:"token expired",success:false})
  }
  res.render('Password-rest',{token})
}
const passwordResetFinally=async(req,res)=>{
  let token=req.params.token;
  const{newPassword}=req.body
  console.log(token)
  if(!token){
    return res.json({msg:"token expired",success:false})
  }
  try{
    let userDetails=await userCollection.findOne({resetToken:token})
    if(userDetails.resetToken===token){
      let hashedPassword=await bcrypt.hashSync(newPassword,salt)
      await userCollection.updateOne({_id:userDetails._id},{$set:{password:hashedPassword,resetToken:""}})
      res.json({msg:"password updated successfully",success:true})
    }
    else{
      return res.json({msg:"token expired",success:false})
    }

  }catch(error){
    return res.json ({msg:"error in reset password or token expired",success:false,error:error.message})
  }
}



module.exports={
   
    createUser,
    updateUser,
    loginUser,
    deleteUser,
    getToken,
    forgetPassword,
    passwordResetFinally,
    getUserDetails





}

