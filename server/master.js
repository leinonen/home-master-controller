/**
 * Master API - Control everything! :D
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Q = require('q');
var Telldus = require('./api/telldus');
var telldusHelper = require('./api/telldus-helper');
var Transformer = require('./transformer');
var DeviceTypes = Transformer.DeviceTypes;
var Actions = {
  ACTION_ON: 'on',
  ACTION_OFF: 'off',
  ACTION_UP: 'up',
  ACTION_DOWN: 'down'
};

var Hue = require('./api/hue');
var ZWave = require('./api/zwave');
var Group = require('../models/group');

/**
 * Get all sensors.
 * @returns {*}
 */
exports.sensors = function () {
  var telldusSensors = Telldus.sensors().then(function (sensors) {
    return Q.all(sensors.map(function (sensor) {
      return Telldus.sensor(sensor.id);
    })).then(Transformer.transformTelldusSensors);
  });
  var promises = [];
  promises.push(telldusSensors.catch(function (err) {
    return [];
  }));
  promises.push(ZWave.sensors().then(Transformer.transformZWaveSensors).catch(function (err) {
    return [];
  }));
  return Q.all(promises).then(flattenArrays).catch(errorHandler);
};

/**
 * Get a specific sensor.
 * @param id
 * @returns {*}
 */
exports.sensor = function (id) {
  // TODO: Add ZWAVE_SENSOR
  return Telldus.sensor(id);
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
  promises.push(Telldus.groups().then(Transformer.transformTelldusGroups).catch(function (err) {
    return [];
  }));
  promises.push(Hue.groups().then(Transformer.transformHueGroups).catch(function (err) {
    return [];
  }));
  promises.push(getGenericGroups().then(Transformer.transformGenericGroups).catch(function (err) {
    return [];
  }));
  return Q.all(promises).then(flattenArrays).catch(errorHandler);
};

/**
 * Get a single group.
 * @param id
 * @param type
 * @returns {*}
 */
exports.group = function (id, type) {
  if (type === DeviceTypes.GENERIC_GROUP) {
    return Group.findById(id).then(Transformer.transformGenericGroup);

  } else if (type === DeviceTypes.TELLDUS_GROUP) {
    return Telldus.device(id).then(Transformer.transformTelldusGroup);

  } else if (type === DeviceTypes.HUE_GROUP) {
    return Hue.group(id).then(Transformer.transformHueGroup);
  }
};


/**
 * Get all devices.
 */
exports.devices = function () {
  var promises = [];
  promises.push(Telldus.devices().then(Transformer.transformTelldusDevices).catch(function (err) {
    console.log(err);
    return [];
  }));
  promises.push(Hue.lights().then(Transformer.transformHueDevices).catch(function (err) {
    console.log(err);
    return [];
  }));
  promises.push(ZWave.devices().then(Transformer.transformZWaveDevices).catch(function (err) {
    console.log(err);
    return [];
  }));
  return Q.all(promises).then(flattenArrays).catch(errorHandler);
};

/**
 * Get a specific device.
 * @param id
 * @param type
 * @returns {*}
 */
exports.device = function (id, type) {

  switch (type) {
    case DeviceTypes.TELLDUS_DEVICE:
      return Telldus.device(id)
        .then(Transformer.transformTelldusDevice).catch(errorHandler);

    case DeviceTypes.HUE_DEVICE:
      return Hue.light(id)
        .then(Transformer.transformHueDevice).catch(errorHandler);

    case DeviceTypes.ZWAVE_SWITCH:
      return ZWave.device(id)
        .then(Transformer.transformZWaveDevice).catch(errorHandler);

    default:
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
  if (type === DeviceTypes.GENERIC_GROUP) {
    return getDevicesForGenericGroup(id)
      .then(function (devices) {
        var promises = devices.map(function (device) {

          switch (device.type) {
            case DeviceTypes.TELLDUS_DEVICE:
              return Telldus.device(device.id)
                .then(Transformer.transformTelldusDevice);

            case DeviceTypes.TELLDUS_GROUP:
              return Telldus.device(device.id)
                .then(Transformer.transformTelldusGroup);

            case DeviceTypes.HUE_DEVICE:
              return Hue.light(device.id)
                .then(Transformer.transformHueDevice);

            case DeviceTypes.HUE_GROUP:
              return Hue.group(device.id)
                .then(Transformer.transformHueGroup);

            case DeviceTypes.GENERIC_GROUP:
              return Group.findById(device.id)
                .then(Transformer.transformGenericGroup);

            case DeviceTypes.ZWAVE_SWITCH:
              return ZWave.device(device.id)
                .then(Transformer.transformZWaveDevice);

            default:
          }

        });
        return Q.all(promises).catch(errorHandler);
      });
  } else {
    return errorHandler(type + ' not implemented');
  }
};

/**
 * Control a device or group.
 * @param id
 * @param params
 */
exports.control = function (id, params) {
  console.log('Control %s: ' + id + ' -> action: %s', params.type, params.action);

  switch (params.type) {
    case DeviceTypes.TELLDUS_DEVICE:
    case DeviceTypes.TELLDUS_GROUP:
      return controlTelldus(id, params);

    case DeviceTypes.HUE_DEVICE:
    case DeviceTypes.HUE_GROUP:
      return controlHue(id, params);

    case DeviceTypes.GENERIC_GROUP:
      return controlGenericGroup(id, params);

    case DeviceTypes.ZWAVE_SWITCH:
      return controlZWave(id, params);

    default:
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
  return item.type === DeviceTypes.TELLDUS_DEVICE || item.type === DeviceTypes.TELLDUS_GROUP;
}

/**
 * Check if item is a hue-device or hue-group.
 * @param item
 * @returns {boolean}
 */
function isHue(item) {
  return item.type === DeviceTypes.HUE_DEVICE || item.type === DeviceTypes.HUE_GROUP;
}

/**
 * Check if item is a generic-group
 * @param item
 * @returns {boolean}
 */
function isGeneric(item) {
  return item.type === DeviceTypes.GENERIC_GROUP;
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
      return isTelldus(item) || isHue(item) || item.type === DeviceTypes.ZWAVE_SWITCH;
    });
  });
}


function getGroupStatus(id) {
  return getDevicesForGenericGroup(id).then(function (items) {
    var promises = items.map(function (item) {
      switch (item.type) {
        case DeviceTypes.TELLDUS_DEVICE:
          return Telldus.device(item.id).then(Transformer.transformHueDevice);

        case DeviceTypes.TELLDUS_GROUP:
          return Telldus.device(item.id).then(Transformer.transformHueGroup);

        case DeviceTypes.HUE_DEVICE:
          return Hue.light(item.id).then(Transformer.transformHueDevice);

        case DeviceTypes.HUE_GROUP:
          return Hue.group(item.id).then(Transformer.transformHueGroup);

        case DeviceTypes.ZWAVE_SWITCH:
          return ZWave.device(item.id).then(Transformer.transformZWaveDevice);
      }
    });
    return Q.all(promises).then(function (response) {
      var groupState = response.every(function(item){
        return item.state.on === true;
      });

      return {
        id: id,
        state: {
          on: groupState
        }
      }
    });
  });
}

exports.getGroupStatus = getGroupStatus;


/**
 * Control a generic group.
 * @param id
 * @param params
 * @returns {*}
 */
function controlGenericGroup(id, params) {
  if (params.action === Actions.ACTION_ON || params.action === Actions.ACTION_OFF) {
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

      switch (item.type) {
        case DeviceTypes.TELLDUS_DEVICE:
        case DeviceTypes.TELLDUS_GROUP:
          return controlTelldus(item.id, params);

        case DeviceTypes.HUE_DEVICE:
        case DeviceTypes.HUE_GROUP:
          return controlHue(item.id, params);

        case DeviceTypes.ZWAVE_SWITCH:
          return controlZWave(item.id, params);
      }
      // TODO: handle generic groups! Recursive call
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
  switch (params.action) {
    case Actions.ACTION_ON:
      return Telldus.turnOn(id);

    case Actions.ACTION_OFF:
      return Telldus.turnOff(id);

    case Actions.ACTION_UP:
      return Telldus.goUp(id);

    case Actions.ACTION_DOWN:
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
  if (params.action === Actions.ACTION_ON) {
    message = {on: true};
  } else if (params.action === Actions.ACTION_OFF) {
    message = {on: false};
  } else if (params.action === 'bri') {
    message = {bri: Number(params.value)};
  } else if (params.action === 'sat') {
    message = {sat: Number(params.value)};
  } else if (params.action === 'hue') {
    message = {hue: Number(params.value)};
  }

  if (params.type === DeviceTypes.HUE_DEVICE) {
    return Hue.setLightState(id, message);
  } else if (params.type === DeviceTypes.HUE_GROUP) {
    return Hue.setGroupAction(id, message);
  }
}

/**
 * Control z-wave device.
 * @param id
 * @param params
 * @returns {*}
 */
function controlZWave(id, params) {
  if (params.action === Actions.ACTION_ON) {
    return ZWave.setOn(id);

  } else if (params.action === Actions.ACTION_OFF) {
    return ZWave.setOff(id);
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
  msg.statusCode = error.statusCode || 400;
  msg.message = error.statusCode === 404 ? 'Not found' : error;
  if (error.hasOwnProperty('request')) {
    msg.url = error.request.url;
  }
  deferred.reject(msg);
  return deferred.promise;
}

