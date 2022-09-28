const mongoose = require('mongoose')

const userScheama= mongoose.Schema({
  username:{
    type:String,
    require:true,
    unique:true
  },
  password:{
    type:String,
    require:true
  }
},{timestamps:true})
const User = mongoose.model('User',userScheama)
module.exports= User