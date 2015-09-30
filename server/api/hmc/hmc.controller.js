var Configuration = require('./configuration/configuration.model');
var Bus = require('../../util/bus');
var Events = require('../../api/hmc/scheduler/events');
var ApiWrapper = require('./api-wrapper');

// API Implementations

var TelldusAPI = require('./telldus/telldus');
var HueAPI = require('./hue/hue');
var ZWaveAPI = require('./zwave/zwave');
var GenericAPI = require('./generic/generic');
var Logger = require('../../util/logger');

// API WRAPPER (Master)

var Master = new ApiWrapper(TelldusAPI, HueAPI, ZWaveAPI, GenericAPI);


// Listen for events here

Bus.on(Events.CONTROL_DEVICE, function(message) {
  Master.control(message.id, message);
});


var errorHandler = (res, err) => {
  Logger.error(err.message);
  res.status(err.statusCode || 400).json(err);
};


// Sensors

exports.sensors = (req, res) => Master
  .sensors()
  .then(sensors => res.json(sensors))
  .catch(err => errorHandler(res, err));

exports.sensor = (req, res) => Master
  .sensor(req.params.id, req.query.type)
  .then(sensor => res.json(sensor))
  .catch(err => errorHandler(res, err));

// Devices

exports.devices = (req, res) => Master
  .devices()
  .then(devices => res.json(devices))
  .catch(err => errorHandler(res, err));

exports.device = (req, res) => Master
  .device(req.params.id, req.query.type)
  .then(device => res.json(device))
  .catch(err => errorHandler(res, err));

// Groups

exports.groups = (req, res) => Master
  .groups()
  .then(groups => res.json(groups))
  .catch(err => errorHandler(res, err));

exports.group = (req, res) => Master
  .group(req.params.id, req.query.type)
  .then(group => res.json(group))
  .catch(err => errorHandler(res, err));

exports.groupDevices = (req, res) => Master
  .groupDevices(req.params.id, req.query.type)
  .then(devices => res.json(devices))
  .catch(err => errorHandler(res, err));

exports.groupState = (req, res) => Master
  .groupState(req.params.id)
  .then(data => res.json(data));

exports.createGroup = (req, res) => Master
  .createGenericGroup(req.body)
  .then(group => res.json(group));

exports.updateGroup = (req, res) => Master
  .updateGenericGroup(req.params.id, req.body)
  .then(group => res.json(group));

exports.deleteGroup = (req, res) => Master
  .removeGenericGroup(req.params.id)
  .then(status => res.json(status));

// Control any device

exports.control = (req, res) => Master
  .control(req.params.id, req.body)
  .then(response => res.json(response))
  .catch(err => errorHandler(res, err));

// Scheduler

exports.schedule = (req, res) => Master
  .schedule(req.params.id)
  .then(schedule => res.json(schedule))
  .catch(err => errorHandler(res, err));

exports.schedules = (req, res) => Master
  .schedules()
  .then(schedules => res.json(schedules))
  .catch(err => errorHandler(res, err));

exports.createSchedule = (req, res) => Master
  .createSchedule(req.body)
  .then(schedule => res.json(schedule))
  .catch(err => errorHandler(res, err));

exports.updateSchedule = (req, res) => Master
  .updateSchedule(req.params.id, req.body)
  .then(schedule => res.json(schedule))
  .catch(err => errorHandler(res, err));

exports.deleteSchedule = (req, res) => Master
  .deleteSchedule(req.params.id)
  .then(response => res.json(response))
  .catch(err => errorHandler(res, err));

// Configuration

exports.readConfiguration = (req, res) => Configuration
  .get()
  .then(cfg => res.json(cfg))
  .catch(err => errorHandler(res, err));

exports.saveConfiguration = (req, res) => Configuration
  .saveConfig(req.body._id, req.body)
  .then(cfg => res.json(cfg))
  .catch(err => errorHandler(res, err));