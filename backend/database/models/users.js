const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
 realName: {
  type: String,
  trim: true,
  required: true
 },
 displayName: {
  type: String,
  trim: true,
  required: true
 },
 email: {
  type: String,
  trim: true
 },
 cell: {
  type: String,
  trim: true,
  required: true
 },
 verificationCode: {
  type: String,
  trim: true,
  required: true
 },
 avatar: {
  type: String
 },
 isAdmin: {
     type: Boolean
 }
});

const User=mongoose.model("Users",UserSchema);

module.exports=User;
