const mongoose=require("mongoose");

mongoose.Promise=global.Promise;

mongoose.connect("mongodb://localhost:27017/smc")
 .then(() => console.log("connected to smc DB on 27017"))
 .catch((error) => console.log("db connect error: "+error));

module.exports=mongoose;
