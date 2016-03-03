'use strict';
const
  winston = require('winston'),
  Hue     = require('../lib/hue/hue'),
  ZWave   = require('../lib/zwave/zwave'),
  Telldus = require('../lib/telldus/telldus'),
  DeviceTypes = require('../lib/device-types'),
  ServiceHandler = require('../lib/service.handler');

function HomeMasterController() {
  this.deviceCallbacks = {};
  this.deviceListCallbacks = [];
  this.deviceControllers = {};
  this._init();
}

HomeMasterController.prototype._init = function() {

  this.addIntegration({
    name: 'ZWave',
    types: [
      DeviceTypes.ZWAVE_SWITCH_BINARY,
      DeviceTypes.ZWAVE_SWITCH_MULTILEVEL
    ],
    deviceHandler: ZWave.device,
    deviceTransformer: ZWave.transformDevice,
    listHandler: ZWave.devices,
    listTransformer: ZWave.transformDevices,
    controlHandler: ZWave.control
  });

  this.addIntegration({
    name: 'Philips Hue',
    types: [DeviceTypes.HUE_DEVICE],
    deviceHandler: Hue.light,
    deviceTransformer: Hue.transformDevice,
    listHandler: Hue.lights,
    listTransformer: Hue.transformDevices,
    controlHandler: Hue.control
  });

  this.addIntegration({
    name: 'Telldus Live',
    types: [DeviceTypes.TELLDUS_DEVICE],
    deviceHandler: Telldus.device,
    deviceTransformer: Telldus.transformDevice,
    listHandler: Telldus.devices,
    listTransformer: Telldus.transformDevices,
    controlHandler: Telldus.control
  });
};

HomeMasterController.prototype.addIntegration = function(integration) {
  winston.info('HMC: Adding integration ' + integration.name);
  integration.types.forEach(function(type) {
    this._addDeviceHandler(type, integration.deviceHandler, integration.deviceTransformer);
    this._addDeviceControl(type, integration.controlHandler);
  }.bind(this));
  this._addDeviceListHandler(integration.listHandler, integration.listTransformer);
};

HomeMasterController.prototype._addDeviceControl = function(type, callback) {
  this.deviceControllers[type] = callback;
};

HomeMasterController.prototype._getDeviceControl = function(type) {
  return this.deviceControllers[type];
};

HomeMasterController.prototype._addDeviceHandler = function(type, callback, transformer) {
  let handler = function(cb, xform) {
    return function(id) {
      return cb(id).then(xform).catch(ServiceHandler.noService);
    };
  };
  this.deviceCallbacks[type] = handler(callback, transformer);
};

HomeMasterController.prototype._getDeviceHandler = function(type) {
  return this.deviceCallbacks[type];
};


HomeMasterController.prototype._addDeviceListHandler = function(callback, transformer) {
  let handler = function(cb, xform) {
    return function() {
      return cb().then(xform).catch(ServiceHandler.noServices);
    };
  };
  this.deviceListCallbacks.push(handler(callback, transformer));
};

HomeMasterController.prototype._getDeviceListHandlers = function() {
  return this.deviceListCallbacks;
};


HomeMasterController.prototype.getDevices = function() {
  let promises = this._getDeviceListHandlers().map(handler => handler());
  return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
};

HomeMasterController.prototype.getDevice = function(id, type) {
  let handler = this._getDeviceHandler(type);
  if (handler) {
    return handler(id);
  } else {
    return Promise.reject('No devicehandler found for type ' + type);
  }
};

HomeMasterController.prototype.control = function(id, params) {
  var control = this._getDeviceControl(params.type);
  if (control) {
    return control(id, params);
  } else {
    return Promise.reject(type + ' controller is not defined');
  }
};


HomeMasterController.prototype.getSensors = function() {
};

HomeMasterController.prototype.getSensor = function(id, type) {
};

HomeMasterController.prototype.getGroups = function() {
};

HomeMasterController.prototype.getGroup = function(id, type) {
};

module.exports = new HomeMasterController();