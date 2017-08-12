var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  mls:{
    type:String,
    required:true
  }

});

var model = mongoose.model('Featured',schema);

module.exports = model;
