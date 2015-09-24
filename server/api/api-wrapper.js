/**
 * Api wrapper. Handle case if service has been disabled in config.
 * Other errors are propagated to the error handler in master.js
 * @type {exports}
 */
var Promise = require('../util/promise');
var Transformer = require('./transformer');
var DeviceTypes = require('./device-types');
var Actions = require('./actions');

function ApiWrapper(telldus, hue, zwave, generic, group) {
  this.Telldus = telldus;
  this.Hue = hue;
  this.ZWave = zwave;
  this.Group = group;
  this.Generic = generic;
}
module.exports = ApiWrapper;


var serviceDisabled = (err) => Promise.reject(err);

var serviceDisabledArray = (err) => {
  if (err.serviceDisabled && err.serviceDisabled === true) {
    return [];
  } else {
    return Promise.reject(err);
  }
};

var flattenArrays = (arr) => arr.reduce((a, b) => a.concat(b));


ApiWrapper.prototype.sensors = function () {
  var wrapper = this;
  var telldusSensors = wrapper.Telldus.sensors()
    .then(sensors => Promise.all(sensors.map(sensor => wrapper.Telldus.sensor(sensor.id))))
    .then(Transformer.TelldusSensors)
    .catch(serviceDisabledArray);

  var promises = [];
  promises.push(telldusSensors.catch(serviceDisabledArray));
  promises.push(wrapper.ZWave.sensors().then(Transformer.ZWaveSensors).catch(serviceDisabledArray));
  return Promise.all(promises).then(flattenArrays);
};



ApiWrapper.prototype.sensor = function (id, type) {
  if (type === DeviceTypes.TELLDUS_SENSOR) {
    return this.Telldus.sensor(id);
  } else if (type === DeviceTypes.ZWAVE_SENSOR) {
    return this.ZWave.sensor(id);
  }
};


ApiWrapper.prototype.groups = function () {
  var promises = [];
  promises.push(this.Telldus.groups().then(Transformer.TelldusGroups).catch(serviceDisabledArray));
  promises.push(this.Hue.groups().then(Transformer.HueGroups).catch(serviceDisabledArray));
  promises.push(this.Generic.groups().then(Transformer.GenericGroups));
  return Promise.all(promises).then(flattenArrays);
};

ApiWrapper.prototype.devices = function () {
  var promises = [];
  promises.push(this.Telldus.devices().then(Transformer.TelldusDevices).catch(serviceDisabledArray));
  promises.push(this.Hue.lights().then(Transformer.HueDevices).catch(serviceDisabledArray));
  promises.push(this.ZWave.devices().then(Transformer.ZWaveDevices).catch(serviceDisabledArray));
  return Promise.all(promises).then(flattenArrays);
};


ApiWrapper.prototype.group = function (id, type) {
  switch (type) {
    case DeviceTypes.GENERIC_GROUP:
      return this.Group.findById(id).then(Transformer.GenericGroup);

    case DeviceTypes.TELLDUS_GROUP:
      return this.Telldus.device(id).then(Transformer.TelldusGroup);

    case DeviceTypes.HUE_GROUP:
      return this.Hue.group(id).then(Transformer.HueGroup);

    default:
      return Promise.reject('Unsupported group ' + type);
  }
};



ApiWrapper.prototype.device = function (id, type) {
  switch (type) {
    case DeviceTypes.TELLDUS_DEVICE:
      return this.Telldus.device(id).then(Transformer.TelldusDevice).catch(serviceDisabled);

    case DeviceTypes.HUE_DEVICE:
      return this.Hue.light(id).then(Transformer.HueDevice).catch(serviceDisabled);

    case DeviceTypes.ZWAVE_SWITCH:
      return this.ZWave.device(id).then(Transformer.ZWaveDevice).catch(serviceDisabled);

    default:
      return Promise.reject('Invalid device type: ' + type);
  }
};


ApiWrapper.prototype.groupDevices = function (id, type) {
  var wrapper = this;
  if (type === DeviceTypes.GENERIC_GROUP) {
    return wrapper.Generic.groupDevices(id).then(devices => {
      var promises = devices.map(device => {

        switch (device.type) {
          case DeviceTypes.TELLDUS_DEVICE:
            return wrapper.Telldus.device(device.id).then(Transformer.TelldusDevice).catch(serviceDisabled);

          case DeviceTypes.TELLDUS_GROUP:
            return wrapper.Telldus.device(device.id).then(Transformer.TelldusGroup).catch(serviceDisabled);

          case DeviceTypes.HUE_DEVICE:
            return wrapper.Hue.light(device.id).then(Transformer.HueDevice).catch(serviceDisabled);

          case DeviceTypes.HUE_GROUP:
            return wrapper.Hue.group(device.id).then(Transformer.HueGroup).catch(serviceDisabled);

          case DeviceTypes.GENERIC_GROUP:
            return wrapper.Group.findById(device.id).then(Transformer.GenericGroup);

          case DeviceTypes.ZWAVE_SWITCH:
            return wrapper.ZWave.device(device.id).then(Transformer.ZWaveDevice).catch(serviceDisabled);

          default:
            return Promise.reject('Invalid device type ' + device.type);
        }

      });
      return Promise.all(promises);
    });
  } else {
    return Promise.reject(type + ' not implemented');
  }
};



ApiWrapper.prototype.control = function (id, params) {
  //console.log('Control %s: ' + id + ' -> action: %s', params.type, params.action);

  switch (params.type) {
    case DeviceTypes.TELLDUS_DEVICE:
    case DeviceTypes.TELLDUS_GROUP:
      return this.controlTelldus(id, params);

    case DeviceTypes.HUE_DEVICE:
    case DeviceTypes.HUE_GROUP:
      return this.controlHue(id, params);

    case DeviceTypes.GENERIC_GROUP:
      return this.controlGenericGroup(id, params);

    case DeviceTypes.ZWAVE_SWITCH:
      return this.controlZWave(id, params);

    default:
      return Promise.reject(params.type + ' is not implemented');
  }
};


ApiWrapper.prototype.groupState = function(id) {
  var wrapper = this;
  return wrapper.Generic.groupDevices(id).then(function (items) {
    var promises = items.map(function (item) {
      switch (item.type) {
        case DeviceTypes.TELLDUS_DEVICE:
          return wrapper.Telldus.device(item.id).then(Transformer.TelldusDevice).catch(serviceDisabled);

        case DeviceTypes.TELLDUS_GROUP:
          return wrapper.Telldus.device(item.id).then(Transformer.HueGroup).catch(serviceDisabled);

        case DeviceTypes.HUE_DEVICE:
          return wrapper.Hue.light(item.id).then(Transformer.HueDevice).catch(serviceDisabled);

        case DeviceTypes.HUE_GROUP:
          return wrapper.Hue.group(item.id).then(Transformer.HueGroup).catch(serviceDisabled);

        case DeviceTypes.ZWAVE_SWITCH:
          return wrapper.ZWave.device(item.id).then(Transformer.ZWaveDevice).catch(serviceDisabled);
      }
    });
    return Promise.all(promises).then(devices => {
      // Group is on if all devices are on
      var groupState = devices.every(device => device.state.on === true);

      return {
        id: id,
        state: {
          on: groupState
        },
        devices: devices
      }
    });
  });
};



ApiWrapper.prototype.createGenericGroup = function (group) {
  return this.Generic.create(group);
};

ApiWrapper.prototype.updateGenericGroup = function (id, group) {
  return this.Generic.update(id, group);
};

ApiWrapper.prototype.removeGenericGroup = function (id) {
  return this.Generic.remove(id);
};



ApiWrapper.prototype.controlGenericGroup = function(id, params) {
  if (params.action === Actions.ACTION_ON ||
    params.action === Actions.ACTION_OFF) {
    return this.controlDevicesInGroup(id, params);
  }
};


ApiWrapper.prototype.controlDevicesInGroup = function(id, params) {
  var wrapper = this;
  return wrapper.Generic.groupDevices(id)
    .then(function(items) {
      // Get actual devices so we can test if they are motorized
      return Promise.all(items.map(item => wrapper.device(item.id, item.type)))
    })
    .then(function (items) {
      var promises = items.map(function (item) {
      params.type = item.type; // Must send correct type!

      switch (item.type) {
        case DeviceTypes.TELLDUS_DEVICE:
          // Handle special case for motorized things!
          var telldusParams = {
            action: params.action,
            type: params.type
          };
          if (item.motorized) {
            if (telldusParams.action === Actions.ACTION_ON) {
              telldusParams.action = Actions.ACTION_UP;
            } else if (params.action === Actions.ACTION_OFF) {
              telldusParams.action = Actions.ACTION_DOWN;
            }
          }
          console.log(item.name + ', type: ' + item.type + ', motorized: ' + item.motorized + ', action: ' + telldusParams.action);
          return wrapper.controlTelldus(item.id, telldusParams);

        case DeviceTypes.TELLDUS_GROUP:
          return wrapper.controlTelldus(item.id, params);

        case DeviceTypes.HUE_DEVICE:
        case DeviceTypes.HUE_GROUP:
          return wrapper.controlHue(item.id, params);

        case DeviceTypes.ZWAVE_SWITCH:
          return wrapper.controlZWave(item.id, params);
      }
    });

    return Promise.all(promises).then(function (response) {
      return {success: 'Group state set to ' + params.action};
    });

  });
};


ApiWrapper.prototype.controlTelldus = function(id, params) {
  console.log('controlTelldus ' + params.type + ' ' + params.action);
  switch (params.action) {
    case Actions.ACTION_ON:
      return this.Telldus.turnOn(id);

    case Actions.ACTION_OFF:
      return this.Telldus.turnOff(id);

    case Actions.ACTION_UP:
      return this.Telldus.goUp(id);

    case Actions.ACTION_DOWN:
      return this.Telldus.goDown(id);
  }
};


ApiWrapper.prototype.controlHue = function(id, params) {
  console.log('controlHue ' + params.type + ' ' + params.action);

  var message = {};
  if (params.action === Actions.ACTION_ON) {
    message = {on: true};
  } else if (params.action === Actions.ACTION_OFF) {
    message = {on: false};
  } else if (params.action === 'colorloop-on') {
    message = {effect: 'colorloop'}
  } else if (params.action === 'colorloop-off') {
    message = {effect: 'none'}
  } else if (params.action === 'bri') {
    message = {bri: Number(params.value)};
  } else if (params.action === 'sat') {
    message = {sat: Number(params.value)};
  } else if (params.action === 'hue') {
    message = {hue: Number(params.value)};
  }

  if (params.type === DeviceTypes.HUE_DEVICE) {
    return this.Hue.setLightState(id, message);
  } else if (params.type === DeviceTypes.HUE_GROUP) {
    return this.Hue.setGroupAction(id, message);
  }
};


ApiWrapper.prototype.controlZWave = function(id, params) {
  if (params.action === Actions.ACTION_ON) {
    return this.ZWave.setOn(id);

  } else if (params.action === Actions.ACTION_OFF) {
    return this.ZWave.setOff(id);
  }
};

