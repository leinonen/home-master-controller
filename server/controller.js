var Master = require('./master');

exports.sensors = function (req, res) {
  Master
    .sensors()
    .then(function (sensors) {
      res.json(sensors);
    })
    .fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.sensor = function (req, res) {
  Master
    .sensor(req.params.id)
    .then(function (sensor) {
      res.json(sensor);
    })
    .fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.devices = function (req, res) {
  Master
    .devices()
    .then(function (devices) {
      res.json(devices);
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.device = function (req, res) {
  Master
    .device(req.params.id, req.query.type)
    .then(function (device) {
      res.json(device);
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.groups = function (req, res) {
  Master
    .groups()
    .then(function (groups) {
      res.json(groups);
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.control = function (req, res) {
  Master
    .control(req.params.id, req.body)
    .then(function (response) {
      res.json(response);
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    });
};
