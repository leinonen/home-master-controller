/**
 * Master API - Control everything! :D
 * @type {exports}
 */
var telldus = require('./api/telldus');
var telldusHelper = require('./api/telldus-helper');

var hue = require('./api/hue');
var Q = require('q');

var Group = require('../models/group');


exports.sensors = function () {
  return telldus.listSensors().then(function (sensors) {
    return Q.all(sensors.map(function (sensor) {
      return telldus.getSensor(sensor.id);
    })).then(transformTelldusSensors);
  });
};

exports.sensor = function (id) {
  return telldus.getSensor(id);
};


function getGenericGroups() {
  return Group.find().execQ();
}
exports.getGenericGroups = getGenericGroups();


function createGenericGroup(group) {
  var g = new Group(group);
  g.save();
  return g;
}

exports.createGenericGroup = createGenericGroup;


/**
 * Get all groups
 */
exports.groups = function () {
  return telldus.listGroups().then(transformTelldusGroups).then(function (telldusGroups) {
    return hue.getGroups().then(transformHueGroups).then(function (hueGroups) {
      return getGenericGroups().then(transformGenericGroups).then(function (genericGroups) {
        return telldusGroups.concat(hueGroups).concat(genericGroups);
      });
    });
  });
};

/**
 * Get all devices
 */
exports.devices = function () {
  return telldus.listDevices().then(transformTelldusDevices).then(function (telldusDevices) {
    return hue.getLights().then(transformHueDevices).then(function (hueDevices) {
      return telldusDevices.concat(hueDevices);
    }).catch(function (err) {
      return errorHandler(err);
    });
  });
};

/**
 * Get a specific device.
 * @param id
 * @param type
 * @returns {*}
 */
exports.device = function (id, type) {
  if (type === 'telldus-device') {
    return telldus.getDevice(id).then(transformTelldusDevice);
  } else if (type === 'hue-device') {
    return hue.getLight(id).then(function (device) {
      device.id = id;
      return transformHueDevice(device);
    });
  } else {
    var deferred = Q.defer();
    deferred.reject('Not implemented');
    return deferred.promise;
  }
};

/**
 * Control a device or group
 * @param device
 */
exports.control = function (id, params) {
  console.log('control ' + id + ' : %s -> action: %s', params.type, params.action);

  if (isTelldus(params)) {
    return controlTelldus(id, params);
  } else if (isHue(params)) {
    return controlHue(id, params);
  } else if (isGeneric(params)) {
    return controlGenericGroup(id, params);
  } else {
    var deferred = Q.defer();
    deferred.reject('Not implemented');
    return deferred.promise;
  }
};


function getDevicesForGenericGroup(id) {
  return Group.findOne({_id: id}).execQ().then(function (group) {
    // TODO: handle generic-group. recursive call?
    return group.items.filter(function (item) {
      return isTelldus(item) || isHue(item);
    });
  });
}

function isTelldus(item) {
  return item.type === 'telldus-device' || item.type === 'telldus-group';
}

function isHue(item) {
  return item.type === 'hue-device' || item.type === 'hue-group';
}

function isGeneric(item) {
  return item.type === 'generic-group';
}

function controlGenericGroup(id, params) {
  if (params.action === 'on' || params.action === 'off') {
    return controlDevicesInGroup(id, params);
  }
}

function controlDevicesInGroup(id, params) {
  return getDevicesForGenericGroup(id).then(function (items) {

    var promises = items.map(function (item) {
      params.type = item.type; // Must send correct type!
      if (isTelldus(item)) {
        return controlTelldus(item.id, params);
      } else if (isHue(item)) {
        return controlHue(item.id, params);
      }
    });
    return Q.all(promises).then(function (response) {
      return {success: 'Group state set to ' + params.action};
    });
  });
}

/**
 * Handle telldus device.
 * @param id
 * @param params
 * @returns {*}
 */
function controlTelldus(id, params) {
  console.log('controlTelldus ' + params.type + ' ' + params.action);
  if (params.action === 'on') {
    return telldus.turnOn(id);
  } else if (params.action === 'off') {
    return telldus.turnOff(id);
  } else if (params.action === 'up') {
    return telldus.goUp(id);
  } else if (params.action === 'down') {
    return telldus.goDown(id);
  }
}


/**
 * Handle Philips Hue device.
 * @param id
 * @param params
 * @returns {*}
 */
function controlHue(id, params) {
  console.log('controlHue ' + params.type + ' ' + params.action);

  var message = {};
  if (params.action === 'on') {
    message = {on: true};
  } else if (params.action === 'off') {
    message = {on: false};
  } else if (params.action === 'bri') {
    message = {bri: Number(params.value)};
  } else if (params.action === 'sat') {
    message = {sat: Number(params.value)};
  } else if (params.action === 'hue') {
    message = {hue: Number(params.value)};
  }

  if (params.type === 'hue-device') {
    return hue.setLightState(id, message);
  } else if (params.type === 'hue-group') {
    return hue.setGroupAction(id, message);
  }
}

/**
 * Error handler
 * @param error
 * @returns {Promise.promise|*}
 */
function errorHandler(error) {
  var deferred = Q.defer();
  var msg = {};
  msg.statusCode = error.statusCode;
  msg.message = error.statusCode === 404 ? 'Not found' : 'error';
  if (error.hasOwnProperty('request')) {
    msg.url = error.request.url;
  }
  deferred.reject(msg);
  return deferred.promise;
}

function transformTelldusSensors(sensors) {
  return sensors.map(function (sensor) {
    sensor.type = 'telldus-sensor';
    return sensor;
  });
}

function transformTelldusGroups(groups) {
  return groups.map(function (group) {
    var item = {};
    item.id = group.id;
    item.name = group.name;
    item.type = 'telldus-group';
    item.methods = telldusHelper.getSupportedMethods(group);
    item.state = {};
    item.state.on = telldusHelper.isOn(group);
    item.devices = group.devices.split(',');
    item.motorized = telldusHelper.isMotorized(group);
    return item;
  });
}

function transformHueGroups(groups) {
  return groups.map(function (group) {
    var item = {};
    item.id = group.id;
    item.name = group.name;
    item.type = 'hue-group';
    item.state = group.action;
    item.devices = group.lights;
    item.motorized = false;
    return item;
  });
}

function transformGenericGroup(group) {
  var item = {};
  item.name = group.name;
  item.id = group._id;
  item.items = [];
  item.items = group.items.map(function (a) {
    return a;
  });
  item.type = 'generic-group';
  item.state = {
    on: false
  };
  item.motorized = false;
  return item;
}

function transformGenericGroups(groups) {
  return groups.map(transformGenericGroup);
}

function transformTelldusDevice(device) {
  var item = {};
  item.id = device.id;
  item.name = device.name;
  item.type = 'telldus-device';
  item.motorized = telldusHelper.isMotorized(device);
  item.methods = telldusHelper.getSupportedMethods(device);
  item.state = {};
  item.state.on = telldusHelper.isOn(device);
  return item;
}

function transformTelldusDevices(devices) {
  return devices.map(transformTelldusDevice);
}

function transformHueDevice(device) {
  var item = {};
  item.id = device.id;
  item.name = device.name;
  item.type = 'hue-device';
  item.modelid = device.modelid;
  item.manufacturername = device.manufacturername;
  item.state = device.state;
  return item;
}

function transformHueDevices(devices) {
  return devices.map(transformHueDevice);
}
