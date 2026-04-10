const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: [true, "User Name alredy Exits"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "Email alredy extis"],
    required: true,
  },
  password:{
    type: String,
    required:true
  }
});

const userModel = mongoose.model("users",userSchema)
module.exports = userModel;