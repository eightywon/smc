const mongoose=require("mongoose");

const PostSchema=new mongoose.Schema({
 postText: {
  type: String,
  trim: true,
 },
 postedByUserId: {
  type: mongoose.Types.ObjectId,
  required: true,
 },
 postDate: {
  type:  Date,
  required: true
 }
});

const Post=mongoose.model("Posts",PostSchema);

module.exports=Post;
