var path = require('path');
var mongoose = require('mongoose-q')();
var fs = require('fs');

var ApiWrapper = require('./server/api/api-wrapper');
var Telldus = require('./server/api/telldus');
var Hue = require('./server/api/hue');
var ZWave = require('./server/api/zwave');

var Generic = require('./server/api/generic');
var Group = require('./models/group');
var Schedule = require('./models/schedule');

var DeviceTypes = require('./server/api/device-types');

var getUserHome = () => {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

var conf = path.join(getUserHome(), '/.hmc.conf');
var config = JSON.parse(fs.readFileSync(conf, 'utf-8'));
mongoose.connect(config.mongo.url, config.mongo.opts);

var wrapper = new ApiWrapper(Telldus, Hue, ZWave, Group, Generic);

wrapper.groups().then(function(a){
  console.log(a);
});

