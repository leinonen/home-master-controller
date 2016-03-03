'use strict';

var mongoose = require('mongoose-q')();

var EventSchema = mongoose.Schema({
  name: String,
  sensor: {type: {type: String}, id: {type: String}},
  items: [{type: {type: String}, id: {type: String}}],
  action: String
});

EventSchema.statics.findById = function (id) {
  return this.findOne({_id: id}).execQ(); // Return promise!
};

EventSchema.statics.findAll = function () {
  return this.find().execQ(); // Return promise!
};

module.exports = mongoose.model('Event', EventSchema);

