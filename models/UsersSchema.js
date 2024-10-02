const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
    
})
UserSchema.add({

    resetToken:{
        type:String,
        default:""
    }
})

module.exports=mongoose.model('users',UserSchema)