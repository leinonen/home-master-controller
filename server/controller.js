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
    .sensor(req.params.id, req.query.type)
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

exports.group = function (req, res) {
  Master
    .group(req.params.id, req.query.type)
    .then(function (group) {
      res.json(group);
    }).catch(function (err) {
      errorHandler(res, err);
    });
};

exports.groupDevices = function (req, res) {
  Master
    .groupDevices(req.params.id, req.query.type)
    .then(function (devices) {
      res.json(devices);
    }).catch(function (err) {
      errorHandler(res, err);
    });
};


exports.groupState = function (req, res) {
  Master.groupState(req.params.id).then(function (data) {
    res.json(data);
  })
};

exports.createGroup = function (req, res) {
  Master
    .createGenericGroup(req.body)
    .then(function (group) {
      res.json(group);
    });
};

exports.updateGroup = function (req, res) {
  Master
    .updateGenericGroup(req.params.id, req.body)
    .then(function (group) {
      res.json(group);
    });
};

exports.deleteGroup = function (req, res) {
  Master
    .removeGenericGroup(req.params.id)
    .then(function (status) {
      res.json(status);
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


// Configuration

exports.readConfiguration = function (req, res) {
  Configuration
    .get()
    .then(function (cfg) {
      res.json(cfg);
    }).catch(errorHandler);
};

exports.saveConfiguration = function (req, res) {
  Configuration
    .saveConfig(req.body._id, req.body)
    .then(function (cfg) {
      res.json(cfg);
    }).catch(errorHandler);
};


exports.schedule = function (req, res) {
  Master
    .schedule(req.params.id)
    .then(function (schedule) {
      res.json(schedule);
    }).catch(errorHandler);
};

exports.schedules = function (req, res) {
  Master
    .schedules()
    .then(function (schedules) {
      res.json(schedules);
    }).catch(errorHandler);
};

exports.createSchedule = function (req, res) {
  Master
    .createSchedule(req.body)
    .then(function (schedule) {
      res.json(schedule);
    }).catch(errorHandler);
};

exports.updateSchedule = function (req, res) {
  Master
    .updateSchedule(req.params.id, req.body)
    .then(function (schedule) {
      res.json(schedule);
    }).catch(errorHandler);
};

exports.deleteSchedule = function (req, res) {
  Master
    .deleteSchedule(req.params.id)
    .then(function (response) {
      res.json(response);
    }).catch(errorHandler);
};