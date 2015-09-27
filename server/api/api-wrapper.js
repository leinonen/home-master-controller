/**
 * Api wrapper. Handle case if service has been disabled in config.
 * Other errors are propagated to the error handler in master.js
 * @type {exports}
 */
var Promise = require('../util/promise');
var Transformer = require('./transformer');
var DeviceTypes = require('./device-types');
var Actions = require('./actions');

var ApiWrapper = module.exports = function(telldus, hue, zwave, generic, group) {
  var TelldusAPI = telldus;
  var HueAPI = hue;
  var ZWaveAPI = zwave;
  var GroupAPI = group;
  var GenericAPI = generic;

  var ZWAVE_SENSOR  = (id) => ZWaveAPI.sensor(id).then(Transformer.ZWaveSensor).catch(serviceDisabled);
  var ZWAVE_SENSORS = ()   => ZWaveAPI.sensors().then(Transformer.ZWaveSensors).catch(serviceDisabledArray);
  var ZWAVE_DEVICE  = (id) => ZWaveAPI.device(id).then(Transformer.ZWaveDevice).catch(serviceDisabled);
  var ZWAVE_DEVICES = ()   => ZWaveAPI.devices().then(Transformer.ZWaveDevices).catch(serviceDisabledArray);

  var HUE_DEVICE  = (id) => HueAPI.light(id).then(Transformer.HueDevice).catch(serviceDisabled);
  var HUE_DEVICES = ()   => HueAPI.lights().then(Transformer.HueDevices).catch(serviceDisabledArray);
  var HUE_GROUP   = (id) => HueAPI.group(id).then(Transformer.HueGroup).catch(serviceDisabled);
  var HUE_GROUPS  = ()   => HueAPI.groups().then(Transformer.HueGroups).catch(serviceDisabledArray);

  var TELLDUS_DEVICE  = (id) => TelldusAPI.device(id).then(Transformer.TelldusDevice).catch(serviceDisabled);
  var TELLDUS_DEVICES = ()   => TelldusAPI.devices().then(Transformer.TelldusDevices).catch(serviceDisabledArray);
  var TELLDUS_GROUP   = (id) => TelldusAPI.group(id).then(Transformer.TelldusGroup).catch(serviceDisabled);
  var TELLDUS_GROUPS  = ()   => TelldusAPI.groups().then(Transformer.TelldusGroups).catch(serviceDisabledArray);
  var TELLDUS_SENSOR  = (id) => TelldusAPI.sensor(id).catch(serviceDisabled);
  var TELLDUS_SENSORS = () => TelldusAPI.sensors()
    .then(sensors => Promise.all(sensors.map(sensor => TelldusAPI.sensor(sensor.id))))
    .then(Transformer.TelldusSensors)
    .catch(serviceDisabledArray);

  var GENERIC_GROUP  = (id) => GroupAPI.findById(id).then(Transformer.GenericGroup);
  var GENERIC_GROUPS = ()   => GenericAPI.groups().then(Transformer.GenericGroups);

  var serviceDisabled = (err) => Promise.reject(err);
  var serviceDisabledArray = (err) => {
    if (err.serviceDisabled && err.serviceDisabled === true) {
      return [];
    } else {
      return Promise.reject(err);
    }
  };

  var getSensors = function () {
    var promises = [];
    promises.push(TELLDUS_SENSORS());
    promises.push(ZWAVE_SENSORS());
    return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
  };

  var getSensor = function (id, type) {
    switch (type) {
      case DeviceTypes.TELLDUS_SENSOR: return TELLDUS_SENSOR(id);
      case DeviceTypes.ZWAVE_SENSOR:   return ZWAVE_SENSOR(id);
      default : return Promise.reject('Unsupported sensor type: ' + type)
    }
  };

  var getGroups = function () {
    var promises = [];
    promises.push(TELLDUS_GROUPS());
    promises.push(HUE_GROUPS());
    promises.push(GENERIC_GROUPS());
    return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
  };

  var getGroup = function (id, type) {
    switch (type) {
      case DeviceTypes.GENERIC_GROUP: return GENERIC_GROUP(id);
      case DeviceTypes.TELLDUS_GROUP: return TELLDUS_GROUP(id);
      case DeviceTypes.HUE_GROUP:     return HUE_GROUP(id);
      default:  return Promise.reject('Unsupported group ' + type);
    }
  };

  var getDevices = function () {
    var promises = [];
    promises.push(TELLDUS_DEVICES());
    promises.push(HUE_DEVICES());
    promises.push(ZWAVE_DEVICES());
    return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
  };

  var getDevice = (id, type) => {
    switch (type) {
      case DeviceTypes.TELLDUS_DEVICE: return TELLDUS_DEVICE(id);
      case DeviceTypes.TELLDUS_GROUP:  return TELLDUS_GROUP(id);
      case DeviceTypes.HUE_DEVICE:     return HUE_DEVICE(id);
      case DeviceTypes.HUE_GROUP:      return HUE_GROUP(id);
      case DeviceTypes.GENERIC_GROUP:  return GENERIC_GROUP(id);
      case DeviceTypes.ZWAVE_SWITCH:   return ZWAVE_DEVICE(id);
      default: return Promise.reject('Invalid device type ' + device.type);
    }
  };

  var groupDevices = (id, type) => {
    if (type === DeviceTypes.GENERIC_GROUP) {
      return GenericAPI.groupDevices(id)
        .then(devices => Promise.all(devices.map(device => getDevice(device.id, device.type))));
    } else {
      return Promise.reject(type + ' not implemented');
    }
  };

  var control = (id, params) => {
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
        return Promise.reject(params.type + ' is not implemented');
    }
  };

  var groupState = (id) => GenericAPI.groupDevices(id)
    .then(items => Promise.all(items.map(item => getDevice(item.id, item.type))).then(devices => {
      // Group is on if all devices are on
      return {
        id: id,
        state: {
          on: devices.every(device => device.state.on === true)
        },
        devices: devices
      }
    }));

  var createGenericGroup = (group) => GenericAPI.create(group);
  var updateGenericGroup = (id, group) => GenericAPI.update(id, group);
  var removeGenericGroup = (id) => GenericAPI.remove(id);

  var controlGenericGroup = (id, params) => {
    if (params.action === Actions.ACTION_ON ||
        params.action === Actions.ACTION_OFF) {
      return controlDevicesInGroup(id, params);
    }
  };

  var getTelldusParamsForItem = (item, params) => {
    var telldusParams = {
      action: params.action,
      type: params.type
    };
    if (item.motorized) {
      if (params.action === Actions.ACTION_ON) {
        telldusParams.action = Actions.ACTION_UP;
      } else if (params.action === Actions.ACTION_OFF) {
        telldusParams.action = Actions.ACTION_DOWN;
      }
    }
    return telldusParams;
  };

  var controlDevicesInGroup = (id, params) => {
    return GenericAPI.groupDevices(id)
      .then(items => Promise.all(items.map(item => getDevice(item.id, item.type))))
      .then(items => {
        var promises = items.map(item => {
          params.type = item.type; // Must send correct type!

          switch (item.type) {
            case DeviceTypes.TELLDUS_DEVICE:
            case DeviceTypes.TELLDUS_GROUP:
              return controlTelldus(item.id, getTelldusParamsForItem(item, params));

            case DeviceTypes.HUE_DEVICE:
            case DeviceTypes.HUE_GROUP:
              return controlHue(item.id, params);

            case DeviceTypes.ZWAVE_SWITCH:
              return controlZWave(item.id, params);
          }
        });

        return Promise.all(promises).then(response => {
          return {success: 'Group state set to ' + params.action};
        });

      });
  };

  var controlTelldus = function(id, params) {
    switch (params.action) {
      case Actions.ACTION_ON:   return TelldusAPI.turnOn(id);
      case Actions.ACTION_OFF:  return TelldusAPI.turnOff(id);
      case Actions.ACTION_UP:   return TelldusAPI.goUp(id);
      case Actions.ACTION_DOWN: return TelldusAPI.goDown(id);
    }
  };

  var createHueParams = (params) => {
    var hueParams = {};
    switch (params.action) {
      case Actions.ACTION_ON:
        hueParams = {on: true};
        break;
      case Actions.ACTION_OFF:
        hueParams = {on: false};
        break;
      case 'colorloop-on':
        hueParams = {effect: 'colorloop'};
        break;
      case 'colorloop-off':
        hueParams = {effect: 'none'};
        break;
      case 'bri':
        hueParams = {bri: Number(params.value)};
        break;
      case 'sat':
        hueParams = {sat: Number(params.value)};
        break;
      case 'hue':
        hueParams = {hue: Number(params.value)};
        break;
    }
    return hueParams;
  };

  var controlHue = function(id, params) {
    var hueParams = createHueParams(params);
    switch (params.type) {
      case DeviceTypes.HUE_DEVICE: return HueAPI.setLightState(id, hueParams);
      case DeviceTypes.HUE_GROUP: return HueAPI.setGroupAction(id, hueParams);
      default: return Promise.reject('controlHue: Unsupported type ' + params.type);
    }
  };

  var controlZWave = (id, params) => {
    if (params.action === Actions.ACTION_ON) {
      return ZWaveAPI.setOn(id);

    } else if (params.action === Actions.ACTION_OFF) {
      return ZWaveAPI.setOff(id);
    }
  };

  return {
    sensor: getSensor,
    sensors: getSensors,
    device: getDevice,
    devices: getDevices,
    group: getGroup,
    groups: getGroups,
    groupDevices: groupDevices,
    groupState: groupState,
    createGenericGroup: createGenericGroup,
    updateGenericGroup: updateGenericGroup,
    removeGenericGroup: removeGenericGroup,
    controlGenericGroup: controlGenericGroup,
    control: control
  };
};
