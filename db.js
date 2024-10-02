const mongoose = require('mongoose');
require('dotenv').config()

 function connectToDB(){
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected!'))
  .catch(()=>console.log('not Connect'))
 }

  module.exports=connectToDB