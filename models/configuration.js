var mongoose = require('mongoose-q')();

module.exports = mongoose.model('Configuration', mongoose.Schema({

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

}));
