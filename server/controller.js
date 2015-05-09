var Sensor = require('./../models/sensor');
var telldus = require('./telldus');
var Q = require('q');
var hue = require('./hue');

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

exports.lights = function (req, res) {
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

exports.goUp = function (req, res) {
  telldus.goUp(req.params.id).then(function (status) {
    res.json(status);
  });
};

exports.goDown = function (req, res) {
  telldus.goDown(req.params.id).then(function (status) {
    res.json(status);
  });
};


exports.hueGroups = function (req, res) {
  hue.getGroups().then(function (groups) {
    res.json(groups);
  }).fail(function (err) {
    res.sendStatus(400).json(err);
  });
};

exports.hueLights = function (req, res) {
  hue.getLights().then(function (lights) {
    res.json(lights);
  }).fail(function (err) {
    res.sendStatus(400).json(err);
  });
};

exports.hueLightState = function (req, res) {
  var id = req.params.id;
  var state = req.body;
  hue.setLightState(id, state).then(function (response) {
    console.log('set light state: ' + state.bri);
    res.json(response);
  }).fail(function (err) {
    res.sendStatus(400).json(err);
  });
};

exports.groupAction = function (req, res) {
  var id = req.params.id;
  var action = req.body;
  hue.setGroupAction(id, action).then(function (response) {
    res.json(response);
  }).fail(function (err) {
    res.sendStatus(400).json(err);
  });
};
