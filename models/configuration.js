var mongoose = require('mongoose-q')();

var ConfigSchema = mongoose.Schema({

  telldus: {
    enabled: Boolean,
    endpoint: String,
    publicKey: String,
    privateKey: String,
    accessToken: String,
    accessTokenSecret: String
  },
  hue: {
    enabled: Boolean,
    endpoint: String
  },
  zwave: {
    enabled: Boolean,
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
