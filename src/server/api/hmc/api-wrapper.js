'use strict';

/**
 * Api wrapper. Handle case if service has been disabled in config.
 * @type {exports}
 */
var Promise = require('../../util/promise');
var DeviceTypes = require('./device-types');
var DeviceActions = require('./device-actions');
var winston = require('winston');

module.exports = function(Telldus, Hue, ZWave, Generic) {

  let ZWAVE_SENSOR = (id) => ZWave.sensor(id).then(ZWave.transformSensor).catch(noService);
  let ZWAVE_SENSORS = () => ZWave.sensors().then(ZWave.transformSensors).catch(noServices);
  let ZWAVE_DEVICE = (id) => ZWave.device(id).then(ZWave.transformDevice).catch(noService);
  let ZWAVE_DEVICES = () => ZWave.devices().then(ZWave.transformDevices).catch(noServices);

  let HUE_DEVICE = (id) => Hue.light(id) .then(Hue.transformDevice).catch(noService);
  let HUE_DEVICES = () => Hue.lights().then(Hue.transformDevices).catch(noServices);
  let HUE_GROUP = (id) => Hue.group(id).then(Hue.transformGroup).catch(noService);
  let HUE_GROUPS = () => Hue.groups().then(Hue.transformGroups).catch(noServices);

  let TELLDUS_DEVICE = (id) => Telldus.device(id).then(Telldus.transformDevice).catch(noService);
  let TELLDUS_DEVICES = () => Telldus.devices().then(Telldus.transformDevices).catch(noServices);
  var TELLDUS_GROUP = (id) => Telldus.group(id).then(Telldus.transformGroup).catch(noService);
  var TELLDUS_GROUPS = () => Telldus.groups().then(Telldus.transformGroups).catch(noServices);
  var TELLDUS_SENSOR = (id) => Telldus.sensor(id).catch(noService);
  var TELLDUS_SENSORS = () => Telldus.sensors()
    .then(sensors => Promise.all(sensors.map(sensor => Telldus.sensor(sensor.id))))
    .then(Telldus.transformSensors)
    .catch(noServices);

  var GENERIC_GROUP  = (id) => Generic.group(id).then(Generic.transformGroup);
  var GENERIC_GROUPS = () => Generic.groups().then(Generic.transformGroups);

  var noService = (err) => Promise.reject(err);

  var noServices = (err) => {
    if (err.serviceDisabled && err.serviceDisabled === true) {
      return [];
    } else {
      return Promise.reject(err);
    }
  };

  var getSensors = () => {
    let promises = [TELLDUS_SENSORS(), ZWAVE_SENSORS()];
    return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
  };

  var getSensor = (id, type) => {
    switch (type) {
      case DeviceTypes.TELLDUS_SENSOR:
        return TELLDUS_SENSOR(id);

      case DeviceTypes.ZWAVE_SENSOR_BINARY:
      case DeviceTypes.ZWAVE_SENSOR_MULTILEVEL:
        return ZWAVE_SENSOR(id);

      default :
        return Promise.reject('Unsupported sensor type: ' + type)
    }
  };

  var getGroups = () => {
    let promises = [TELLDUS_GROUPS(), HUE_GROUPS(), GENERIC_GROUPS()];
    return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
  };

  var getGroup = (id, type) => {
    switch (type) {
      case DeviceTypes.GENERIC_GROUP:
        return GENERIC_GROUP(id);
      case DeviceTypes.TELLDUS_GROUP:
        return TELLDUS_GROUP(id);
      case DeviceTypes.HUE_GROUP:
        return HUE_GROUP(id);
      default:
        return Promise.reject('Unsupported group ' + type);
    }
  };

  var getDevices = () => {
    let promises = [TELLDUS_DEVICES(), HUE_DEVICES(), ZWAVE_DEVICES()];
    return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
  };

  var getDevice = (id, type) => {
    switch (type) {
      case DeviceTypes.TELLDUS_DEVICE:
        return TELLDUS_DEVICE(id);

      case DeviceTypes.TELLDUS_GROUP:
        return TELLDUS_GROUP(id);

      case DeviceTypes.HUE_DEVICE:
        return HUE_DEVICE(id);

      case DeviceTypes.HUE_GROUP:
        return HUE_GROUP(id);

      case DeviceTypes.GENERIC_GROUP:
        return GENERIC_GROUP(id);

      case DeviceTypes.ZWAVE_SWITCH_BINARY:
      case DeviceTypes.ZWAVE_SWITCH_MULTILEVEL:
        return ZWAVE_DEVICE(id);

      default:
        return Promise.reject('Invalid device type ' + device.type);
    }
  };

  var groupDevices = (id, type) => {
    if (type === DeviceTypes.GENERIC_GROUP) {
      return Generic.groupDevices(id)
        .then(devices => Promise.all(devices.map(device => getDevice(device.id, device.type))));
    } else {
      return Promise.reject(type + ' not implemented');
    }
  };

  var control = (id, params, initiator) => {
    winston.info('HMC: Control %s %s -> %s. Triggered by: %s', params.type, id, params.action, initiator);
    switch (params.type) {
      case DeviceTypes.TELLDUS_DEVICE:
      case DeviceTypes.TELLDUS_GROUP:
        return getDevice(id, params.type).then(device => controlTelldus(id, telldusParam(device, params)));

      case DeviceTypes.HUE_DEVICE:
      case DeviceTypes.HUE_GROUP:
        return controlHue(id, params);

      case DeviceTypes.GENERIC_GROUP:
        return controlGenericGroup(id, params);

      case DeviceTypes.ZWAVE_SWITCH_BINARY:
      case DeviceTypes.ZWAVE_SWITCH_MULTILEVEL:
        return controlZWave(id, params);

      default:
        return Promise.reject(params.type + ' is not implemented');
    }
  };

  var groupState = (id) => Generic.groupDevices(id)
    .then(items => Promise.all(items.map(item => getDevice(item.id, item.type))).then(devices => {
      return {
        id: id,
        state: {
          // Group is on if all devices are on
          on: devices.every(device => device.state.on === true)
        },
        devices: devices
      }
    }));

  var createGenericGroup = (group) => Generic.create(group);
  var updateGenericGroup = (id, group) => Generic.update(id, group);
  var removeGenericGroup = (id) => Generic.remove(id);

  var controlGenericGroup = (id, params) => {
    if (params.action === DeviceActions.ACTION_ON ||
        params.action === DeviceActions.ACTION_OFF) {
      return controlDevicesInGroup(id, params);
    }
  };

  var telldusParam = (item, params) => {
    var telldusParams = {
      action: params.action,
      type: params.type
    };
    if (item.motorized) {
      if (params.action === DeviceActions.ACTION_ON) {
        winston.debug('Motorized device: ON -> UP');
        telldusParams.action = DeviceActions.ACTION_UP;
      } else if (params.action === DeviceActions.ACTION_OFF) {
        winston.debug('Motorized device: OFF -> DOWN');
        telldusParams.action = DeviceActions.ACTION_DOWN;
      }
    }
    return telldusParams;
  };

  var controlDevicesInGroup = (id, params) => Generic
    .groupDevices(id)
    .then(items => Promise.all(items.map(item => getDevice(item.id, item.type))))
    .then(items => {
      var promises = items.map(item => {
        params.type = item.type; // Must send correct type!

        switch (item.type) {
          case DeviceTypes.TELLDUS_DEVICE:
          case DeviceTypes.TELLDUS_GROUP:
            return controlTelldus(item.id, telldusParam(item, params));

          case DeviceTypes.HUE_DEVICE:
          case DeviceTypes.HUE_GROUP:
            return controlHue(item.id, params);

          case DeviceTypes.ZWAVE_SWITCH_BINARY:
          case DeviceTypes.ZWAVE_SWITCH_MULTILEVEL:
            return controlZWave(item.id, params);
        }
      });

      return Promise.all(promises).then(response => {
        return {success: 'Group state set to ' + params.action};
      });

    });

  var controlTelldus = function(id, params) {
    winston.info('TELLDUS: Control device -> ' + id + ', action: ' + params.action);
    switch (params.action) {
      case DeviceActions.ACTION_ON:
        return Telldus.turnOn(id);

      case DeviceActions.ACTION_OFF:
        return Telldus.turnOff(id);

      case DeviceActions.ACTION_UP:
        return Telldus.goUp(id);

      case DeviceActions.ACTION_DOWN:
        return Telldus.goDown(id);
    }
  };

  var createHueParams = (params) => {
    var hueParams = {};
    switch (params.action) {
      case DeviceActions.ACTION_ON:
        hueParams = {on: true};
        break;

      case DeviceActions.ACTION_OFF:
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
      case DeviceTypes.HUE_DEVICE:
        return Hue.setLightState(id, hueParams);

      case DeviceTypes.HUE_GROUP:
        return Hue.setGroupAction(id, hueParams);

      default:
        return Promise.reject('controlHue: Unsupported type ' + params.type);
    }
  };

  var controlZWave = (id, params) => {
    switch (params.action) {
      case DeviceActions.ACTION_ON:
        return ZWave.setOn(id);

      case DeviceActions.ACTION_OFF:
        return ZWave.setOff(id);

      case DeviceActions.ACTION_LEVEL:
        winston.info('ZWAVE: setLevel: ' + params.value);
        return ZWave.setLevel(id, params.value);

      default:
        return Promise.reject('Invalid action ' + params.action);
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
