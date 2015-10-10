'use strict';

/**
 * Z-Wave / Razberry API Wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */

var http = require('request-promise-json');
var Configuration = require('../../configuration/configuration.model.js');
var Transformer = require('./zwave-transformer');
var Promise = require('../../../util/promise');
var Logger = require('../../../util/logger');

var sessionCookie = undefined;

exports.transformDevice = Transformer.ZWaveDevice;
exports.transformDevices = Transformer.ZWaveDevices;
exports.transformSensor = Transformer.ZWaveSensor;
exports.transformSensors = Transformer.ZWaveSensors;

const ZWAVE_DEVICES = '/ZAutomation/api/v1/devices';

var getFormData = (config) => {
  return {
    form: true,
    login: config.username,
    password: config.password,
    keepme: false,
    default_ui: 1
  };
};

var zwave_login = (config) => http.request({
    method: 'POST',
    url: config.endpoint + '/ZAutomation/api/v1/login',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: getFormData(config)
  })
  .then(res => res.data.sid)
  .catch(err => Promise.reject(err));

var handleZWaveResponse = (res) => {
  if (res.code === 200){
    return res;
  } else {
    return Promise.reject('Some kind of error');
  }
};

var createLoginHeader = () => {
  return {
    'Accept': 'application/json',
    'Cookie': 'ZWAYSession=' + sessionCookie
  };
};

var zwave_get = (url) => http.request({
    method: 'GET',
    headers: createLoginHeader(),
    url: url
  })
  .then(res => handleZWaveResponse(res))
  .catch(err => Promise.reject(err));

var zwave_login_get = (config, uri) => {
  if (sessionCookie === undefined) {
    return zwave_login(config)
      .then(sid => {
        sessionCookie = sid;
        Logger.debug('ZWAVE: Login successful');
        return zwave_get(config.endpoint + uri);
      });
  } else {
    return zwave_get(config.endpoint + uri);
  }
};

var isConnectionError = (code) => [
  'ECONNREFUSED', 'ENETUNREACH', 'ETIMEDOUT'
].indexOf(code) !== -1;

var errorHandler = (err) => {
  if (isConnectionError(err.code)) {
    return Promise.reject({
      statusCode: 500,
      message: 'ZWAVE: Unable to connect to Z-Wave endpoint. Check your configuration'
    });
  } else {
    Logger.error('ZWAVE: ' + err.message);
    return Promise.reject(err);
  }
};

var doGet = (path) => Configuration.get()
  .then(config => {
    if (!config.zwave.enabled) {
      return Promise.reject({serviceDisabled: true, message: 'ZWave not enabled'});
    }
    return zwave_login_get(config.zwave, path);
  })
  .catch(errorHandler);

var isSwitch = (device) => device.deviceType === 'switchBinary' || device.deviceType === 'switchMultilevel';
var isSensor = (device) => device.deviceType === 'sensorMultilevel' || device.deviceType === 'sensorBinary';

var handleResponse = (res) => {
  Logger.info('ZWAVE: Operation successful');
  return {
    status: res.message
  };
};

exports.devices = () => doGet(ZWAVE_DEVICES)
  .then(res => res.data.devices.filter(isSwitch));

exports.device = (id) => doGet(ZWAVE_DEVICES + '/' + id)
  .then(res => res.data);

exports.setOn = (id) => doGet(ZWAVE_DEVICES + '/' + id + '/command/on')
  .then(res => handleResponse(res));

exports.setOff = (id) => doGet(ZWAVE_DEVICES + '/' + id + '/command/off')
  .then(res => handleResponse(res));

exports.setLevel = (id, level) => doGet(ZWAVE_DEVICES + '/' + id + '/command/exact?level=' + level)
  .then(handleResponse);

exports.sensors = () => doGet(ZWAVE_DEVICES)
  .then(res => res.data.devices.filter(isSensor));

exports.sensor = (id) => doGet(ZWAVE_DEVICES + '/' + id)
  .then(res => res.data);

exports.status = () => doGet('/ZAutomation/api/v1/status').then(res => res.data);
exports.restart = () => doGet('/ZAutomation/api/v1/restart').then(res => res.data);

exports.transform = require('./zwave-transformer');