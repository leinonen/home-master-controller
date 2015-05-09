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

app.get('/api/sensors', controller.sensors);
app.get('/api/sensors/:id', controller.sensor);

app.get('/api/devices', controller.devices);

app.get('/api/device/:id', controller.device);

app.get('/api/groups', controller.lights);

app.get('/api/turnOn/:id', controller.turnOn);
app.get('/api/turnOff/:id', controller.turnOff);

app.get('/api/up/:id', controller.goUp);
app.get('/api/down/:id', controller.goDown);

app.get('/api/hue/groups', controller.hueGroups);
app.get('/api/hue/lights', controller.hueLights);

app.put('/api/hue/lights/:id/state', controller.hueLightState);
app.put('/api/hue/groups/:id/action', controller.groupAction);

app.listen(config.port);
console.log('server listening on port %d', config.port);

// Fetch new data every 60 seconds and store in database.
/*setInterval(function () {
  collector.populateSensors();
}, 1000 * 60);
*/
