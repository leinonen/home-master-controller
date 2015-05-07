var mongoose = require('mongoose');

module.exports = mongoose.model('Sensor', mongoose.Schema({
  name: String,
  readings: [{
    date: Date,
    data: String,
    value: Number
  }]
}));
