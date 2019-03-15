const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  postCreator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  postDate: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Post", PostSchema);
