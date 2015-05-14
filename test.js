var mongoose = require('mongoose-q')();
var Configuration = require('./models/configuration');
var conf = require('./server/config');

var hue = require('./server/api/hue');

mongoose.connect(conf.mongo.url, conf.mongo.opts);

/*
function getConfig(){
  return Configuration.findOne().execQ();
}


getConfig().then(function(cfg){
  console.log(cfg);
}).catc;*/

hue.getLights().then(function(lights){
  console.log('success');
  console.log(lights);
}).catch(function(err){
  console.log('error');
  console.log(err);
});