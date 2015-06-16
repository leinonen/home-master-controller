var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose-q')();
var fs = require('fs');
//var config = require('./server/config');
var controller = require('./server/controller');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var conf = path.join(getUserHome(), '/.hmc.conf');

if (!fs.existsSync(conf)){
  console.log('Configuration file missing! Create .hmc.conf in your home directory.');
}

var config = JSON.parse(fs.readFileSync(conf, 'utf-8'));

console.log(getUserHome());

mongoose.connect(config.mongo.url, config.mongo.opts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/api/configuration', controller.readConfiguration);
app.post('/api/configuration', controller.saveConfiguration);

app.get('/api/sensors', controller.sensors);
app.get('/api/sensors/:id', controller.sensor);

app.get('/api/devices', controller.devices);
app.get('/api/device/:id', controller.device);

app.get('/api/groups', controller.groups);
app.post('/api/groups', controller.createGroup);
//app.get('/api/genericGroups', controller.getGenericGroups);
app.get('/api/groupState/:id', controller.groupState);

app.get('/api/group/:id', controller.group);
app.post('/api/group/:id', controller.updateGroup);
app.delete('/api/group/:id', controller.deleteGroup);
app.get('/api/group/:id/devices', controller.groupDevices);


app.post('/api/control/:id', controller.control);

app.use(function (err, req, res, next) {
  console.error(err.message);
  res.sendStatus(err.status || 500);
});

app.listen(config.port);
console.log('server listening on port %d', config.port);

