'use strict';

var mongoose = require('mongoose-q')();

var GroupSchema = mongoose.Schema({
  name: String,
  items: [{type: {type: String}, id: {type: String}}]
});

GroupSchema.statics.findById = function (id) {
  return this.findOne({_id: id}).execQ(); // Return promise!
};

GroupSchema.statics.findAll = function () {
  return this.find().execQ(); // Return promise!
};

module.exports = mongoose.model('Group', GroupSchema);

