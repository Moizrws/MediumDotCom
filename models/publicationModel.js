const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PublicationSchema = new Schema({
  
  name: {
    type: String,
    required: true,
    unique:true
  },
  tagline: {
    type: String
  },
  description: {
    type: String
  },
  editor: {
    type: String,
    required: true
  },
  followers: {
    type: Array,
  },
  category: {
    type: Array,
  },
  tags: {
    type: Array,
  },
  writer: {
      type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String
  }
});

const Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;
