var mongoose = require('mongoose-q')();
var config = require('./server/config');
var ZWave = require('./server/api/zwave');
var Transformer = require('./server/transformer');

mongoose.connect(config.mongo.url, config.mongo.opts);


ZWave
  .device('ZWayVDev_zway_2-0-37')
  //.then(Transformer.transformZWaveDevices)
  .then(function (data) {

    console.log(data);
  });
