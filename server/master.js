/**
 * Master API - Control everything! :D
 * Currently supports Telldus and Philips Hue.
 * @type {exports}
 * @author Peter Leinonen
 */
var Q = require('q');
var Telldus = require('./api/telldus');
var telldusHelper = require('./api/telldus-helper');
var Hue = require('./api/hue');
var Group = require('../models/group');


/**
 * Get all sensors.
 * @returns {*}
 */
exports.sensors = function () {
  return Telldus.listSensors().then(function (sensors) {
    return Q.all(sensors.map(function (sensor) {
      return Telldus.getSensor(sensor.id);
    })).then(transformTelldusSensors);
  });
};

/**
 * Get a specific sensor.
 * @param id
 * @returns {*}
 */
exports.sensor = function (id) {
  return Telldus.getSensor(id);
};

/**
 * Get all generic groups.
 * @returns {*}
 */
function getGenericGroups() {
  return Group.findAll();
}
exports.getGenericGroups = getGenericGroups;


/**
 * Create a generic group.
 * @param group
 * @returns {Group}
 */
function createGenericGroup(group) {
  var deferred = Q.defer();
  var g = new Group(group);
  g.save();
  deferred.resolve(g);
  return deferred.promise;
}
exports.createGenericGroup = createGenericGroup;


/**
 * Update a generic group.
 * @param id
 * @param group
 * @returns {*}
 */
function updateGenericGroup(id, group) {
  return Group.findById(id).then(function (g) {
    g.name = group.name;
    g.items = group.items;
    g.save();
    return g;
  });
}
exports.updateGenericGroup = updateGenericGroup;

/**
 * Delete a generic group.
 * @param id
 * @returns {*}
 */
function deleteGenericGroup(id) {
  return Group.findById(id).then(function (g) {
    g.remove();
    return 'Group removed!';
  });
}
exports.deleteGenericGroup = deleteGenericGroup;


/**
 * Get all groups.
 */
exports.groups = function () {
  var promises = [];
  promises.push(Telldus.listGroups().then(transformTelldusGroups));
  promises.push(Hue.getGroups().then(transformHueGroups));
  promises.push(getGenericGroups().then(transformGenericGroups));
  return Q.all(promises).then(flattenArrays).catch(errorHandler);
};

/**
 * Get a single group.
 * @param id
 * @param type
 * @returns {*}
 */
exports.group = function (id, type) {
  if (type === 'generic-group') {
    return Group.findById(id).then(transformGenericGroup);

  } else if (type === 'telldus-group') {
    return Telldus.getDevice(id).then(transformTelldusGroup);

  } else if (type === 'hue-group') {
    return Hue.getGroup(id).then(transformHueGroup);
  }
};


/**
 * Get all devices.
 */
exports.devices = function () {
  var promises = [];
  promises.push(Telldus.listDevices().then(transformTelldusDevices));
  promises.push(Hue.getLights().then(transformHueDevices));
  return Q.all(promises).then(flattenArrays).catch(errorHandler);
};

/**
 * Get a specific device.
 * @param id
 * @param type
 * @returns {*}
 */
exports.device = function (id, type) {
  if (type === 'telldus-device') {
    return Telldus.getDevice(id).then(transformTelldusDevice).catch(errorHandler);

  } else if (type === 'hue-device') {
    return Hue.getLight(id).then(transformHueDevice).catch(errorHandler);

  } else {
    return errorHandler('Get ' + type + ' is not implemented');
  }
};

/**
 * Get all devices for a specific group.
 * @param id
 * @param type
 * @returns {*}
 */
exports.groupDevices = function (id, type) {
  if (type === 'generic-group') {
    return getDevicesForGenericGroup(id).then(function (devices) {
      var promises = devices.map(function (device) {

        if (device.type === 'telldus-device') {
          return Telldus.getDevice(device.id).then(transformTelldusDevice);

        } else if (device.type === 'telldus-group') {
          return Telldus.getDevice(device.id).then(transformTelldusGroup);

        } else if (device.type === 'hue-device') {
          return Hue.getLight(device.id).then(transformHueDevice);

        } else if (device.type === 'hue-group') {
          return Hue.getGroup(device.id).then(transformHueGroup);

        } else {
          return Group.findById(id).then(transformGenericGroup);
        }
      });
      return Q.all(promises).catch(errorHandler);
    });
  } else {
    return errorHandler('Not implemented');
  }
};

/**
 * Control a device or group.
 * @param device
 */
exports.control = function (id, params) {
  console.log('Control %s :' + id + ' -> action: %s', params.type, params.action);

  if (isTelldus(params)) {
    return controlTelldus(id, params);

  } else if (isHue(params)) {
    return controlHue(id, params);

  } else if (isGeneric(params)) {
    return controlGenericGroup(id, params);

  } else {
    return errorHandler(params.type + ' is not implemented');
  }
};


// Helper functions!

/**
 * Flatten an array of arrays into a single array.
 * @param arr
 * @returns {*}
 */
function flattenArrays(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(b);
  });
}

/**
 * Check if item is a telldus-device or telldus-group.
 * @param item
 * @returns {boolean}
 */
function isTelldus(item) {
  return item.type === 'telldus-device' || item.type === 'telldus-group';
}

/**
 * Check if item is a hue-device or hue-group.
 * @param item
 * @returns {boolean}
 */
function isHue(item) {
  return item.type === 'hue-device' || item.type === 'hue-group';
}

/**
 * Check if item is a generic-group
 * @param item
 * @returns {boolean}
 */
function isGeneric(item) {
  return item.type === 'generic-group';
}

/**
 * Get list of VALID devices for a generic group.
 * @param id
 * @returns {*}
 */
function getDevicesForGenericGroup(id) {
  return Group.findById(id).then(function (group) {
    return group.items.filter(function (item) {
      // TODO: add generic-group! also rename function
      return isTelldus(item) || isHue(item);
    });
  });
}

/**
 * Control a generic group.
 * @param id
 * @param params
 * @returns {*}
 */
function controlGenericGroup(id, params) {
  if (params.action === 'on' || params.action === 'off') {
    return controlDevicesInGroup(id, params);
  }
}

/**
 * Control all devices for a generic group.
 * @param id
 * @param params
 * @returns {*}
 */
function controlDevicesInGroup(id, params) {
  return getDevicesForGenericGroup(id).then(function (items) {

    var promises = items.map(function (item) {
      params.type = item.type; // Must send correct type!
      if (isTelldus(item)) {
        return controlTelldus(item.id, params);
      } else if (isHue(item)) {
        return controlHue(item.id, params);
      }
      // TODO: handle generic groups!
    });
    return Q.all(promises).then(function (response) {
      // TODO: update group with correct state?
      return {success: 'Group state set to ' + params.action};
    });
  });
}

/**
 * Control a telldus device / group.
 * @param id
 * @param params
 * @returns {*}
 */
function controlTelldus(id, params) {
  console.log('controlTelldus ' + params.type + ' ' + params.action);
  if (params.action === 'on') {
    return Telldus.turnOn(id);
  } else if (params.action === 'off') {
    return Telldus.turnOff(id);
  } else if (params.action === 'up') {
    return Telldus.goUp(id);
  } else if (params.action === 'down') {
    return Telldus.goDown(id);
  }
}


/**
 * Control a Philips Hue device / group.
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
    return Hue.setLightState(id, message);
  } else if (params.type === 'hue-group') {
    return Hue.setGroupAction(id, message);
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
  msg.message = error.statusCode === 404 ? 'Not found' : error;
  if (error.hasOwnProperty('request')) {
    msg.url = error.request.url;
  }
  deferred.reject(msg);
  return deferred.promise;
}

/**
 * Transform a telldus sensor to custom format.
 * @param sensors
 * @returns {*}
 */
function transformTelldusSensors(sensors) {
  return sensors.map(function (sensor) {
    sensor.type = 'telldus-sensor';
    return sensor;
  });
}

/**
 * Transform a telldus group to custom format.
 * @param group
 * @returns {{}}
 */
function transformTelldusGroup(group) {
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
}
/**
 * Transform a telldus group to custom format.
 * @param groups
 * @returns {*}
 */
function transformTelldusGroups(groups) {
  return groups.map(transformTelldusGroup);
}

/**
 * Transform a hue group to custom format.
 * @param group
 * @returns {{}}
 */
function transformHueGroup(group) {
  var item = {};
  item.id = group.id;
  item.name = group.name;
  item.type = 'hue-group';
  item.state = group.action;
  item.devices = group.lights;
  item.motorized = false;
  return item;
}

/**
 * Transform a list of hue groups to custom format.
 * @param groups
 * @returns {*}
 */
function transformHueGroups(groups) {
  return groups.map(transformHueGroup);
}

/**
 * Transform a generic group (as in mongo model) to custom format.
 * @param group
 * @returns {{}}
 */
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

/**
 * Transform a list of generic groups to custom format.
 * @param groups
 * @returns {*}
 */
function transformGenericGroups(groups) {
  return groups.map(transformGenericGroup);
}


/**
 * Transform a telldus device to custom format.
 * @param device
 * @returns {{}}
 */
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

/**
 * Transform a list of telldus devices to custom format.
 * @param devices
 * @returns {*}
 */
function transformTelldusDevices(devices) {
  return devices.map(transformTelldusDevice);
}

/**
 * Transform a Hue device to custom format.
 * @param device
 * @returns {{}}
 */
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

/**
 * Transform a list of Hue devices to custom format.
 * @param devices
 * @returns {*}
 */
function transformHueDevices(devices) {
  return devices.map(transformHueDevice);
}
