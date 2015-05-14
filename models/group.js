var mongoose = require('mongoose');

module.exports = mongoose.model('Group', mongoose.Schema({
  name: String,
  items: [{type: {type: String}, id: {type: Number}}]
}));
