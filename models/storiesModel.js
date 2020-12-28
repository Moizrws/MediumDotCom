const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StoriesSchema = new Schema({
  
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  content: {
    type: String
  },
  author: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true,
    default:0
  },
  tags: {
    type: Array,
  },
  topics: {
      type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String
  },
  publicationId: {
    type: String
  },
  categoryName:{
    type: Array
  }
});

const Stories = mongoose.model('Stories', StoriesSchema);

module.exports = Stories;
