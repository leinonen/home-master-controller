var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose-q')();
var fs = require('fs');
var homedir = require('homedir');
var controller = require('./server/controller');
var ScheduleService = require('./models/schedule');
var Scheduler = require('./server/scheduler');
var scheduler = new Scheduler(ScheduleService);
var conf = path.join(homedir(), '/.hmc.conf');

if (!fs.existsSync(conf)) {
  console.log('Configuration file missing! Create .hmc.conf in your home directory.');
  process.exit(0);
}

var config = JSON.parse(fs.readFileSync(conf, 'utf-8'));

mongoose.connect(config.mongo.url, config.mongo.opts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/client/public')));

app.get('/api/configuration', controller.readConfiguration);
app.post('/api/configuration', controller.saveConfiguration);

app.get('/api/sensors', controller.sensors);
app.get('/api/sensors/:id', controller.sensor);

app.get('/api/devices', controller.devices);
app.get('/api/device/:id', controller.device);

app.get('/api/groups', controller.groups);
app.post('/api/groups', controller.createGroup);
app.get('/api/groupState/:id', controller.groupState);

app.get('/api/group/:id', controller.group);
app.post('/api/group/:id', controller.updateGroup);
app.delete('/api/group/:id', controller.deleteGroup);
app.get('/api/group/:id/devices', controller.groupDevices);

app.post('/api/control/:id', controller.control);

// Scheduler
app.get('/api/schedules', controller.schedules);
app.post('/api/schedules', controller.createSchedule);
app.get('/api/schedules/:id', controller.schedule);
app.put('/api/schedules/:id', controller.updateSchedule);
app.delete('/api/schedules/:id', controller.deleteSchedule);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.sendStatus(err.status || 500);
});

app.listen(config.port);
console.log('Home Master Controller is running on port %d', config.port);

scheduler.start();

process.on('uncaughtException', function (error) {
  console.log(error.stack);
});
