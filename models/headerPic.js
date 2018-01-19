var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  url:{
    type:String,
    required:true
  }
});

var model = mongoose.model('HeaderPic',schema);

module.exports = model;
