var Master = require('./master');
var Configuration = require('../models/configuration');

function errorHandler(response, error) {
  console.log(error);
  response.status(error.statusCode || 400).json(error);
}

exports.sensors = function (req, res) {
  Master
    .sensors()
    .then(function (sensors) {
      res.json(sensors);
    })
    .catch(function (err) {
      errorHandler(res, err);
    });
};

exports.sensor = function (req, res) {
  Master
    .sensor(req.params.id)
    .then(function (sensor) {
      res.json(sensor);
    })
    .catch(function (err) {
      errorHandler(res, err);
    });
};

exports.devices = function (req, res) {
  Master
    .devices()
    .then(function (devices) {
      res.json(devices);
    }).catch(function (err) {
      errorHandler(res, err);
    });
};

exports.device = function (req, res) {
  Master
    .device(req.params.id, req.query.type)
    .then(function (device) {
      res.json(device);
    }).catch(function (err) {
      errorHandler(res, err);
    });
};

exports.groups = function (req, res) {
  Master
    .groups()
    .then(function (groups) {
      res.json(groups);
    }).catch(function (err) {
      errorHandler(res, err);
    });
};

exports.control = function (req, res) {
  Master
    .control(req.params.id, req.body)
    .then(function (response) {
      res.json(response);
    }).catch(function (err) {
      errorHandler(res, err);
    });
};


exports.readConfiguration = function (req, res) {
  Configuration
    .findOne()
    .exec(function (err, cfg) {
      if (err) {
        errorHandler(res, err);
      }
      if (cfg) {
        res.json(cfg);
      } else {
        errorHandler(res, 'Missing configuration');
      }
    });
};

exports.saveConfiguration = function (req, res) {
  var data = req.body;
  Configuration
    .findOne(data._id)
    .exec(function (err, cfg) {
      if (err) {
        errorHandler(res, err);
      }
      if (cfg) {
        cfg.hue = data.hue;
        cfg.telldus = data.telldus;
        cfg.save();
        res.json(cfg);
      } else {
        var c = new Configuration({hue: data.hue, telldus: data.telldus});
        c.save();
        return res.json(c);
      }
    });
};