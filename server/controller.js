var Master = require('./master');
var Configuration = require('../models/configuration');

var errorHandler = (response, error) => {
  console.log(error.message);
  response.status(error.statusCode || 400).json(error);
}

exports.sensors = (req, res) => {
  Master
    .sensors()
    .then(sensors => res.json(sensors))
    .catch(err => errorHandler(res, err));
};

exports.sensor = (req, res) => {
  Master
    .sensor(req.params.id, req.query.type)
    .then(sensor => res.json(sensor))
    .catch(err => errorHandler(res, err));
};

exports.devices = (req, res) => {
  Master
    .devices()
    .then(devices => res.json(devices))
    .catch(err => errorHandler(res, err));
};

exports.device = (req, res) => {
  Master
    .device(req.params.id, req.query.type)
    .then(device => res.json(device))
    .catch(err => errorHandler(res, err));
};

exports.groups = (req, res) => {
  Master
    .groups()
    .then(groups => res.json(groups))
    .catch(err => errorHandler(res, err));
};

exports.group = (req, res) => {
  Master
    .group(req.params.id, req.query.type)
    .then(group => res.json(group))
    .catch(err => errorHandler(res, err));
};

exports.groupDevices = (req, res) => {
  Master
    .groupDevices(req.params.id, req.query.type)
    .then(devices => res.json(devices))
    .catch(err => errorHandler(res, err));
};

exports.groupState = (req, res) => {
  Master
    .groupState(req.params.id)
    .then(data => res.json(data));
};

exports.createGroup = (req, res) => {
  Master
    .createGenericGroup(req.body)
    .then(group => res.json(group));
};

exports.updateGroup = (req, res) => {
  Master
    .updateGenericGroup(req.params.id, req.body)
    .then(group => res.json(group));
};

exports.deleteGroup = (req, res) => {
  Master
    .removeGenericGroup(req.params.id)
    .then(status => res.json(status));
};

exports.control = (req, res) => {
  Master
    .control(req.params.id, req.body)
    .then(response => res.json(response))
    .catch(err => errorHandler(res, err));
};


// Configuration

exports.readConfiguration = (req, res) => {
  Configuration
    .get()
    .then(cfg => res.json(cfg))
    .catch(err => errorHandler(res, err));
};

exports.saveConfiguration = (req, res) => {
  Configuration
    .saveConfig(req.body._id, req.body)
    .then(cfg => res.json(cfg))
    .catch(err => errorHandler(res, err));
};


exports.schedule = (req, res) => {
  Master
    .schedule(req.params.id)
    .then(schedule => res.json(schedule))
    .catch(err => errorHandler(res, err));
};

exports.schedules = (req, res) => {
  Master
    .schedules()
    .then(schedules => res.json(schedules))
    .catch(err => errorHandler(res, err));
};

exports.createSchedule = (req, res) => {
  Master
    .createSchedule(req.body)
    .then(schedule => res.json(schedule))
    .catch(err => errorHandler(res, err));
};

exports.updateSchedule = (req, res) => {
  Master
    .updateSchedule(req.params.id, req.body)
    .then(schedule => res.json(schedule))
    .catch(err => errorHandler(res, err));
};

exports.deleteSchedule = (req, res) => {
  Master
    .deleteSchedule(req.params.id)
    .then(response => res.json(response))
    .catch(err => errorHandler(res, err));
};
