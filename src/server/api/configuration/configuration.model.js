'use strict';

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
    endpoint: String,
    username: String,
    password: String
  }

});

ConfigSchema.statics.get = function (id) {
  return this.findOne().execQ(); // Return promise!
};

ConfigSchema.statics.saveConfig = function (id, config) {
  return this.findById(id)
    .then(function (cfg) {
      if (cfg) {
        cfg.hue = config.hue;
        cfg.telldus = config.telldus;
        cfg.zwave = config.zwave;
        cfg.save();
        return cfg;
      } else {
        var c = new Configuration({
          hue: config.hue,
          telldus: config.telldus,
          zwave: config.zwave
        });
        c.save();
        return c;
      }
    });
};

ConfigSchema.statics.findById = function (id) {
  return this.findOne({_id: id}).execQ(); // Return promise!
};

var Configuration = mongoose.model('Configuration', ConfigSchema);

module.exports = Configuration;
