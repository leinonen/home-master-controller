/*var mongoose = require('mongoose-q')();
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
*/

var SunCalc = require('suncalc');

var lat = 57.7;
var lng = 11.9667;
var times = SunCalc.getTimes(new Date(), lat, lng);

console.log(times.sunrise.toString().substring(16, 24));
console.log(times.sunset.toString().substring(16, 24));