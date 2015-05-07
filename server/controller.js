var Sensor = require('./../models/sensor');
var telldus = require('./telldus');
var Q = require('q');

exports.sensors = function (req, res) {
  /*Sensor
   .find()
   .exec(function (err, sensors) {
   if (err || !sensors) {
   res.sendStatus(400).end();
   }
   res.json(sensors);
   }); */
  telldus.listSensors().then(function (sensors) {
    var promises = sensors.map(function (sensor) {
      return telldus.getSensor(sensor.id);
    });

    Q.all(promises).then(function (list) {
      res.json(list);
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    })

  }).fail(function (err) {
    res.sendStatus(400).json(err);
  });
};

exports.sensor = function (req, res) {
  /*Sensor
   .findOne({_id: req.params.id})
   .exec(function (err, sensor) {
   if (err || !sensor) {
   res.sendStatus(400).end();
   }
   res.json(sensor);
   });*/
  telldus.getSensor(req.params.id).then(function (sensor) {
    res.json(sensor);
  }).fail(function (err) {
    res.sendStatus(400).json(err);
  });
};

exports.devices = function (req, res) {
  telldus
    .listDevices()
    .then(function (devices) {
      res.json(devices.filter(function (d) {
        return d.type === 'device';
      }));
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.device = function (req, res) {
  telldus
    .getDevice(req.params.id)
    .then(function (device) {
      res.json(device);
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.groups = function (req, res) {
  telldus
    .listDevices()
    .then(function (devices) {
      res.json(devices.filter(function (d) {
        return d.type === 'group';
      }));
    }).fail(function (err) {
      res.sendStatus(400).json(err);
    });
};

exports.turnOn = function (req, res) {
  telldus.turnOn(req.params.id).then(function (status) {
    res.json(status);
  });
};

exports.turnOff = function (req, res) {
  telldus.turnOff(req.params.id).then(function (status) {
    res.json(status);
  });
};
