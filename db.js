const mongoose = require('mongoose');

 function connectToDB(){
mongoose.connect('mongodb://localhost:27017/blogsss')
  .then(() => console.log('Connected!'))
  .catch(()=>console.log('not Connect'))
 }

  module.exports=connectToDB