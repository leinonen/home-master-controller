'use strict';

/**
 * Telldus API wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */

var winston = require('winston');
var Promise = require('../../util/promise');
var Configuration = require('../../components/configuration/configuration.model.js');
var Transformer = require('./telldus-transformer');
var DeviceActions = require('../../lib/device-actions');
var Methods = require('./telldus-methods');
var TelldusHelper = require('./telldus-helper');
var TelldusConnector = require('./telldus-connector');
var ServiceHandler = require('../../lib/service.handler');

var METHODS = Methods.TELLSTICK_TURNON | Methods.TELLSTICK_TURNOFF |
  Methods.TELLSTICK_UP | Methods.TELLSTICK_DOWN | Methods.TELLSTICK_STOP;

// jshint ignore:start
var TELLSTICK_TYPE_DEVICE = 1;
var TELLSTICK_TYPE_GROUP = 2;
var TELLSTICK_TYPE_SCENE = 3;
// jshint ignore:end
var TELLSTICK_TEMPERATURE = 1;

exports.transformDevice = Transformer.TelldusDevice;
exports.transformDevices = Transformer.TelldusDevices;
exports.transformGroup = Transformer.TelldusGroup;
exports.transformGroups = Transformer.TelldusGroups;
exports.transformSensor = Transformer.TelldusSensor;
exports.transformSensors = Transformer.TelldusSensors;

/**
 * Make the actual api call to telldus.
 * @param path
 * @param params
 * @returns {*}
 */
var apiCall = (path, params) =>
  Configuration.get()
  .then(config => {
    if (!config.telldus.enabled) {
      return ServiceHandler.serviceDisabled('Telldus not enabled');
    }
    return TelldusConnector.get(config.telldus, path, params);
  });


let call = (path) => apiCall(path, {supportedMethods: METHODS});

let callById = (path, id) => apiCall(path, {supportedMethods: METHODS, id: id });

exports.devices = () => call('devices/list')
  .then(response => response.device.filter(device => device.type === 'device'));

exports.groups = () => call('devices/list')
  .then(response => response.device.filter(device => device.type === 'group'));

//exports.device = (id) => apiCall('device/info', {supportedMethods: METHODS, id: id});
var getDevice = exports.device = (id) => callById('device/info', id);

var getSensor = exports.sensor = (id) => apiCall('sensor/info', {supportedMethods: TELLSTICK_TEMPERATURE, id: id});

exports.sensors = () => apiCall('sensors/list', {supportedMethods: TELLSTICK_TEMPERATURE})
  .then(response => response.sensor)
  .then(sensors => Promise.all(sensors.map(sensor => getSensor(sensor.id))));

var turnOn = exports.turnOn = (id) => callById('device/turnOn', id);
var turnOff = exports.turnOff = (id) => callById('device/turnOff', id);
var goUp = exports.goUp = (id) => callById('device/up', id);
var goDown = exports.goDown = (id) => callById('device/down', id);

var telldusParam = (item, params) => {
  var telldusParams = {
    action: params.action,
    type: params.type
  };
  if (telldusHelper.isMotorized(item)) {
    winston.info('Device is motorized!');
    if (params.action === DeviceActions.ACTION_ON) {
      winston.info('Motorized device: ON -> UP');
      telldusParams.action = DeviceActions.ACTION_UP;
    } else if (params.action === DeviceActions.ACTION_OFF) {
      winston.info('Motorized device: OFF -> DOWN');
      telldusParams.action = DeviceActions.ACTION_DOWN;
    }
  } else {
    winston.info('Device is not motorized');
  }
  return telldusParams;
};

// TODO: Get device before calling control, because we need to check if it is motorized
exports.control = function(id, params) {
  return getDevice(id).then(function(device) {
    var par = telldusParam(device, params);
    winston.info('device', device);
    winston.info('params', params);
    winston.info('TELLDUS: Control device -> ' + id + ', action: ' + par.action);
    switch (par.action) {
      case DeviceActions.ACTION_ON:
        return turnOn(id);

      case DeviceActions.ACTION_OFF:
        return turnOff(id);

      case DeviceActions.ACTION_UP:
        return goUp(id);

      case DeviceActions.ACTION_DOWN:
        return goDown(id);
    }
  });
};
