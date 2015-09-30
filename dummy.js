var path = require('path');
var mongoose = require('mongoose-q')();
var fs = require('fs');
var homedir = require('homedir');

var ApiWrapper = require('./server/api/hmc/api-wrapper');
var Telldus = require('./server/api/hmc/telldus/telldus');
var Hue = require('./server/api/hmc/hue/hue');
var ZWave = require('./server/api/hmc/zwave/zwave');

var Generic = require('./server/api/hmc/generic/generic');
var Group = require('./server/api/hmc/generic/group.model.js');
var Schedule = require('./server/api/hmc/scheduler/schedule.model.js');

var DeviceTypes = require('./server/api/hmc/device-types');

var conf = path.join(homedir(), '/.hmc.conf');
var config = JSON.parse(fs.readFileSync(conf, 'utf-8'));
mongoose.connect(config.mongo.url, config.mongo.opts);

//var wrapper = new ApiWrapper(Telldus, Hue, ZWave, Group, Generic);

ZWave.devices().then(function(a){
  console.log(a);
});

