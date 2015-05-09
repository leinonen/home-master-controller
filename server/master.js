/**
 * Master API - Control everything! :D
 * @type {exports}
 */
var telldus = require('./telldus');
var hue = require('./hue');
var Q = require('q');

var telldusHelper = require('./telldus-helper');


/**
 * Get all sensors
 */
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

/**
 * Get all groups
 */
exports.groups = function () {
  var telldusGroups = telldus.listGroups().then(transformTelldusGroups);
  var hueGroups = hue.getGroups().then(transformHueGroups);
  return telldusGroups.then(function (td) {
    return hueGroups.then(function (hd) {
      return td.concat(hd);
    });
  });
};

/**
 * Get all devices
 */
exports.devices = function () {
  var telldusDevices = telldus.listDevices().then(transformTelldusDevices);
  var hueDevices = hue.getLights().then(transformHueDevices);
  return telldusDevices.then(function (td) {
    return hueDevices.then(function (hd) {
      return td.concat(hd);
    });
  });
};

/**
 * Get a specific device.
 * @param id
 * @param deviceType
 * @returns {*}
 */
exports.device = function (id, deviceType) {
  if (deviceType === 'telldus-device') {
    return telldus.getDevice(id);
  } else if (deviceType === 'hue-device') {
    //return hue.getLight(id);
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
  console.log('control %d : %s -> action: %s', id, params.type, params.action);

  if (params.type === 'telldus-device') {
    return controlTelldus(id, params);

  } else if (params.type === 'hue-device') {

    return controlHue(id, params);
  }
};

/**
 * Handle telldus device.
 * @param id
 * @param params
 * @returns {*}
 */
function controlTelldus(id, params) {
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
  if (params.action === 'on') {
    return hue.setLightState(id, {on: true});
  } else if (params.action === 'off') {
    return hue.setLightState(id, {on: false});
  } else if (params.action === 'bri') {
    console.log('set brightness to ' + params.value);
    return hue.setLightState(id, {bri: Number(params.value)})
  }
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
    return item;
  });
}

function transformTelldusDevices(devices) {
  return devices.map(function (device) {
    var item = {};
    item.id = device.id;
    item.name = device.name;
    item.type = 'telldus-device';
    item.motorized = telldusHelper.isMotorized(device);
    item.methods = telldusHelper.getSupportedMethods(device);
    item.state = {};
    item.state.on = telldusHelper.isOn(device);
    return item;
  });
}

function transformHueDevices(devices) {
  return devices.map(function (device) {
    var item = {};
    item.id = device.id;
    item.name = device.name;
    item.type = 'hue-device';
    item.modelid = device.modelid;
    item.manufacturername = device.manufacturername;
    item.state = device.state;
    return item;
  });
}
