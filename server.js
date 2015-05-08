var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./server/config');
var controller = require('./server/controller');
//var collector = require('./server/collector');

//mongoose.connect(config.mongo.url, config.mongo.opts);
//console.log('connecting to %s', config.mongo.url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/sensors', controller.sensors);
app.use('/api/sensors/:id', controller.sensor);

app.use('/api/devices', controller.devices);

app.use('/api/device/:id', controller.device);

app.use('/api/groups', controller.groups);

app.use('/api/turnOn/:id', controller.turnOn);
app.use('/api/turnOff/:id', controller.turnOff);

app.use('/api/up/:id', controller.goUp);
app.use('/api/down/:id', controller.goDown);

app.use('/api/hue/groups', controller.hueGroups);
app.use('/api/hue/lights', controller.hueLights);

app.listen(config.port);
console.log('server listening on port %d', config.port);

// Fetch new data every 60 seconds and store in database.
/*setInterval(function () {
  collector.populateSensors();
}, 1000 * 60);
*/
