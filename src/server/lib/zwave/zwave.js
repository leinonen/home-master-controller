'use strict';

/**
 * Z-Wave / Razberry API Wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */

const
  winston = require('winston'),
  Configuration = require('../../components/configuration/configuration.model.js'),
  Transformer = require('./zwave-transformer'),
  DeviceActions = require('../device-actions'),
  HPromise = require('../../util/promise'),
  ServiceHandler = require('../../lib/service.handler'),
  ZWaveConnector = require('./zwave-connector');

exports.transformDevice = Transformer.ZWaveDevice;
exports.transformDevices = Transformer.ZWaveDevices;
exports.transformSensor = Transformer.ZWaveSensor;
exports.transformSensors = Transformer.ZWaveSensors;

const
  ZWAVE_DEVICES = '/ZAutomation/api/v1/devices',
  allowedSwitches = ['switchBinary', 'switchMultilevel'],
  allowedSensors = ['sensorMultilevel', 'sensorBinary'],
  isSwitch = (device) => allowedSwitches.indexOf(device.deviceType) !== -1,
  isSensor = (device) => allowedSensors.indexOf(device.deviceType) !== -1,
  isConnectionError = (code) => ['ECONNREFUSED', 'ENETUNREACH', 'ETIMEDOUT'].indexOf(code) !== -1,
  handleResponse = (res) => {
    winston.info('ZWAVE: Operation successful');
    return {
      status: res.message
    };
  },
  errorHandler = (err) => {
    if (isConnectionError(err.code)) {
      return HPromise.reject({
        statusCode: 500,
        message: 'ZWAVE: Unable to connect to Z-Wave endpoint. Check your configuration'
      });
    } else {
      winston.error(err);
      winston.error('ZWAVE: ' + err.message);
      //return Promise.reject(err);
      return HPromise.resolve({data:{devices:[]}});
    }
  },
  doGet = (path) => {
    return Configuration.get()
      .then(config => {
        if (!config.zwave.enabled) {
          return ServiceHandler.serviceDisabled('ZWave not enabled');
        } else {
          return ZWaveConnector.get(config.zwave, path);
        }
      })
      .catch(errorHandler);
  };

exports.devices = () =>
  doGet(ZWAVE_DEVICES)
  .then(res => res.data.devices.filter(isSwitch));

exports.device = (id) =>
  doGet(ZWAVE_DEVICES + '/' + id)
  .then(res => res.data);

var setOn = exports.setOn = (id) =>
  doGet(ZWAVE_DEVICES + '/' + id + '/command/on')
  .then(res => handleResponse(res));

var setOff = exports.setOff = (id) =>
  doGet(ZWAVE_DEVICES + '/' + id + '/command/off')
  .then(res => handleResponse(res));

var setLevel = exports.setLevel = (id, level) =>
  doGet(ZWAVE_DEVICES + '/' + id + '/command/exact?level=' + level)
  .then(handleResponse);

exports.sensors = () =>
  doGet(ZWAVE_DEVICES)
  .then(res => res.data.devices.filter(isSensor));

exports.sensor = (id) =>
  doGet(ZWAVE_DEVICES + '/' + id)
  .then(res => res.data);

exports.status = () =>
  doGet('/ZAutomation/api/v1/status')
  .then(res => res.data);

exports.restart = () =>
  doGet('/ZAutomation/api/v1/restart')
  .then(res => res.data);

//exports.transform = require('./zwave-transformer');

var controlZWave = (id, params) => {
  switch (params.action) {
    case DeviceActions.ACTION_ON:
      return setOn(id);

    case DeviceActions.ACTION_OFF:
      return setOff(id);

    case DeviceActions.ACTION_LEVEL:
      winston.info('ZWAVE: setLevel: ' + params.value);
      return setLevel(id, params.value);

    default:
      return HPromise.reject('Invalid action ' + params.action);
  }
};

exports.control = controlZWave;