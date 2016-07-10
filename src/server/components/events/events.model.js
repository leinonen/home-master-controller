'use strict';

var mongoose = require('mongoose-q')();

var EventSchema = mongoose.Schema({
  name: String,
  sensor: {type: {type: String}, id: {type: String}},
  sensorAction: String,
  devices: [{type: {type: String}, id: {type: String}}],
  deviceAction: String
});

EventSchema.statics.findById = function (id) {
  return this.findOne({_id: id}).execQ(); // Return promise!
};

EventSchema.statics.findAll = function () {
  return this.find().execQ(); // Return promise!
};

module.exports = mongoose.model('Event', EventSchema);

