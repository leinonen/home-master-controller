/**
 * Api wrapper. Handle case if service has been disabled in config.
 * Other errors are propagated to the error handler in master.js
 * @type {exports}
 */
var Q = require('q');
var Telldus = require('./telldus');
var Hue = require('./hue');
var ZWave = require('./zwave');
var Group = require('../../models/group');
var Generic = require('./generic');
var Transformer = require('./transformer');
var DeviceTypes = require('./device-types');
var Actions = require('./actions');

exports.sensors = function () {
  var telldusSensors = Telldus.sensors().then(function (sensors) {
    return Q.all(sensors.map(function (sensor) {
      return Telldus.sensor(sensor.id);
    })).then(Transformer.TelldusSensors).catch(serviceDisabledArray);
  });
  var promises = [];
  promises.push(telldusSensors.catch(serviceDisabledArray));
  promises.push(ZWave.sensors().then(Transformer.ZWaveSensors).catch(serviceDisabledArray));
  return Q.all(promises).then(flattenArrays);
};


exports.sensor = function (id, type) {
  if (type === DeviceTypes.TELLDUS_SENSOR) {
    return Telldus.sensor(id);
  } else if (type === DeviceTypes.ZWAVE_SENSOR) {
    return ZWave.sensor(id);
  }
};


exports.groups = function () {
  var promises = [];
  promises.push(Telldus.groups().then(Transformer.TelldusGroups).catch(serviceDisabledArray));
  promises.push(Hue.groups().then(Transformer.HueGroups).catch(serviceDisabledArray));
  promises.push(Generic.groups().then(Transformer.GenericGroups));
  return Q.all(promises).then(flattenArrays);
};

exports.group = function (id, type) {
  switch (type) {
    case DeviceTypes.GENERIC_GROUP:
      return Group.findById(id).then(Transformer.GenericGroup);

    case DeviceTypes.TELLDUS_GROUP:
      return Telldus.device(id).then(Transformer.TelldusGroup);

    case DeviceTypes.HUE_GROUP:
      return Hue.group(id).then(Transformer.HueGroup);

    default:
      return makeErrorPromise('Unsupported group ' + type);
  }
};

exports.devices = function () {
  var promises = [];
  promises.push(Telldus.devices().then(Transformer.TelldusDevices).catch(serviceDisabledArray));
  promises.push(Hue.lights().then(Transformer.HueDevices).catch(serviceDisabledArray));
  promises.push(ZWave.devices().then(Transformer.ZWaveDevices).catch(serviceDisabledArray));
  return Q.all(promises).then(flattenArrays);
};

exports.device = function (id, type) {
  switch (type) {
    case DeviceTypes.TELLDUS_DEVICE:
      return Telldus.device(id).then(Transformer.TelldusDevice).catch(serviceDisabled);

    case DeviceTypes.HUE_DEVICE:
      return Hue.light(id).then(Transformer.HueDevice).catch(serviceDisabled);

    case DeviceTypes.ZWAVE_SWITCH:
      return ZWave.device(id).then(Transformer.ZWaveDevice).catch(serviceDisabled);

    default:
      return makeErrorPromise('Invalid device type: ' + type);
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
    return Generic.groupDevices(id).then(function (devices) {
      var promises = devices.map(function (device) {

        switch (device.type) {
          case DeviceTypes.TELLDUS_DEVICE:
            return Telldus.device(device.id).then(Transformer.TelldusDevice).catch(serviceDisabled);

          case DeviceTypes.TELLDUS_GROUP:
            return Telldus.device(device.id).then(Transformer.TelldusGroup).catch(serviceDisabled);

          case DeviceTypes.HUE_DEVICE:
            return Hue.light(device.id).then(Transformer.HueDevice).catch(serviceDisabled);

          case DeviceTypes.HUE_GROUP:
            return Hue.group(device.id).then(Transformer.HueGroup).catch(serviceDisabled);

          case DeviceTypes.GENERIC_GROUP:
            return Group.findById(device.id).then(Transformer.GenericGroup);

          case DeviceTypes.ZWAVE_SWITCH:
            return ZWave.device(device.id).then(Transformer.ZWaveDevice).catch(serviceDisabled);

          default:
            return makeErrorPromise('Invalid device type ' + device.type);
        }

      });
      return Q.all(promises);
    });
  } else {
    return makeErrorPromise(type + ' not implemented');
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
      return makeErrorPromise(params.type + ' is not implemented');
  }
};


function groupState(id) {
  return Generic.groupDevices(id).then(function (items) {
    var promises = items.map(function (item) {
      switch (item.type) {
        case DeviceTypes.TELLDUS_DEVICE:
          return Telldus.device(item.id).then(Transformer.TelldusDevice).catch(serviceDisabled);

        case DeviceTypes.TELLDUS_GROUP:
          return Telldus.device(item.id).then(Transformer.HueGroup).catch(serviceDisabled);

        case DeviceTypes.HUE_DEVICE:
          return Hue.light(item.id).then(Transformer.HueDevice).catch(serviceDisabled);

        case DeviceTypes.HUE_GROUP:
          return Hue.group(item.id).then(Transformer.HueGroup).catch(serviceDisabled);

        case DeviceTypes.ZWAVE_SWITCH:
          return ZWave.device(item.id).then(Transformer.ZWaveDevice).catch(serviceDisabled);
      }
    });
    return Q.all(promises).then(function (devices) {
      // Group is on if all devices are on
      var groupState = devices.every(function (device) {
        return device.state.on === true;
      });

      return {
        id: id,
        state: {
          on: groupState
        },
        devices: devices
      }
    });
  });
}

exports.groupState = groupState;


exports.createGenericGroup = function(group){
  return Generic.create(group);
};

exports.updateGenericGroup = function(id, group){
  return Generic.update(id, group);
};

exports.removeGenericGroup = function(id){
  return Generic.remove(id);
};



/**
 * Control a generic group.
 * @param id
 * @param params
 * @returns {*}
 */
function controlGenericGroup(id, params) {
  if (params.action === Actions.ACTION_ON ||
    params.action === Actions.ACTION_OFF) {
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
  return Generic.groupDevices(id).then(function (items) {

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


function makeErrorPromise(msg) {
  var deferred = Q.defer();
  deferred.reject(msg);
  return deferred.promise;
}


function serviceDisabled(err) {
  return makeErrorPromise(err);
}


function serviceDisabledArray(err) {
  if (err.serviceDisabled && err.serviceDisabled === true) {
    console.log(err.message);
    return [];
  } else {
    return makeErrorPromise(err);
  }
}


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


