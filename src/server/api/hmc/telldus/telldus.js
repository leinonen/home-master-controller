'use strict';

/**
 * Telldus API wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */

var Qs = require('querystring');
var OAuth = require('oauth');
var http = require('request-promise-json');
var Promise = require('../../../util/promise');
var Configuration = require('../../configuration/configuration.model.js');
var Transformer = require('./telldus-transformer');
var Methods = require('./telldus-methods');
var METHODS = Methods.TELLSTICK_TURNON | Methods.TELLSTICK_TURNOFF |
  Methods.TELLSTICK_UP | Methods.TELLSTICK_DOWN | Methods.TELLSTICK_STOP;

var TELLSTICK_TYPE_DEVICE = 1;
var TELLSTICK_TYPE_GROUP = 2;
var TELLSTICK_TYPE_SCENE = 3;

var TELLSTICK_TEMPERATURE = 1;

function getConfig(callback) {
  return Configuration.findOne().execQ();
}

function errorHandler(err){
  if (err.code === 'ECONNREFUSED' ||
      err.code === 'ENETUNREACH' ||
      err.code === 'ETIMEDOUT') {
    return Promise.reject({
      statusCode: 500,
      message: 'Unable to connect to Telldus endpoint. Check your configuration'
    });
  } else {
    return Promise.reject(err);
  }
}

var createOAuthParams = (url, params, config) => {
  let oauth = new OAuth.OAuth(null, null,
    config.telldus.publicKey,
    config.telldus.privateKey, '1.0', null, 'HMAC-SHA1');
  let oauthParameters = oauth._prepareParameters(
    config.telldus.accessToken,
    config.telldus.accessTokenSecret, 'GET', url, params);
  let messageParameters = {};
  oauthParameters.forEach(params => messageParameters[params[0]] = params[1]);
  return messageParameters;
};

/**
 * Make the actual api call to telldus.
 * @param path
 * @param params
 * @returns {*}
 */
var apiCall = (path, params) => {
  return Configuration.get().then(config => {
    if (!config.telldus.enabled) {
      return Promise.reject({serviceDisabled: true, message: 'Telldus not enabled'});
    }
    let url = config.telldus.endpoint + path;
    let oAuthParams = createOAuthParams(url, params, config);
    return http.get(url + '?' + Qs.stringify(oAuthParams)).catch(errorHandler);
  });
};

exports.transformDevice = Transformer.TelldusDevice;
exports.transformDevices = Transformer.TelldusDevices;
exports.transformGroup = Transformer.TelldusGroup;
exports.transformGroups = Transformer.TelldusGroups;
exports.transformSensors = Transformer.TelldusSensors;

exports.devices = () => apiCall('devices/list', {supportedMethods: METHODS})
  .then(response => response.device.filter(device => device.type === 'device'));

exports.groups = () => apiCall('devices/list',  {supportedMethods: METHODS})
  .then(response => response.device.filter(device => device.type === 'group'));

exports.device = (id) => apiCall('device/info', {supportedMethods: METHODS, id: id});

exports.sensors = () => apiCall('sensors/list', {supportedMethods: TELLSTICK_TEMPERATURE})
  .then(response => response.sensor);

exports.sensor = (id) => apiCall('sensor/info', {supportedMethods: TELLSTICK_TEMPERATURE, id: id});

exports.turnOn = (id) => apiCall('device/turnOn', {supportedMethods: METHODS, id: id});

exports.turnOff = (id) => apiCall('device/turnOff', {supportedMethods: METHODS, id: id});

exports.goUp = (id) => apiCall('device/up', {supportedMethods: METHODS, id: id});

exports.goDown = (id) => apiCall('device/down', {supportedMethods: METHODS, id: id});
