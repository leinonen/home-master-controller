var mongoose = require('mongoose-q')();
var config = require('./server/config');
var ZWave = require('./server/api/zwave');
var Transformer = require('./server/transformer');

mongoose.connect(config.mongo.url, config.mongo.opts);


ZWave
  .devices()
  .then(Transformer.transformZWaveDevices)
  .then(function (devices) {

    console.log('-- devices --');
    console.log(devices);
  });
