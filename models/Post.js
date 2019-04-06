const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  
  postid:{
    type:String,
  },
  remarks:{
    type:String,
  }
});
module.exports = User = mongoose.model("posts", PostSchema);
