var mongoose = require('mongoose-q')();

var ConfigSchema = mongoose.Schema({

  telldus: {
    endpoint: String,
    publicKey: String,
    privateKey: String,
    accessToken: String,
    accessTokenSecret: String
  },
  hue: {
    endpoint: String
  }

});

ConfigSchema.statics.get = function (id) {
  return this.findOne().execQ(); // Return promise!
};

ConfigSchema.statics.findById = function (id) {
  return this.findOne({_id: id}).execQ(); // Return promise!
};

module.exports = mongoose.model('Configuration', ConfigSchema);
