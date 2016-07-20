'use strict';
var mongoose = require('mongoose-q')();

var ScheduleSchema = mongoose.Schema({
  name: String,
  items: [{type: {type: String}, id: {type: String}}],
  action: String,
  active: Boolean,
  time: String,
  sunrise: Boolean,
  sunset: Boolean,
  random: Number,
  weekdays: [String]
});

ScheduleSchema.statics.findById = function (id) {
  return this.findOne({_id: id}).execQ(); // Return promise!
};

ScheduleSchema.statics.findAll = function () {
  return this.find().execQ(); // Return promise!
};

module.exports = mongoose.model('Schedule', ScheduleSchema);

