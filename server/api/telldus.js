/**
 * Telldus API wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Q = require('q');
var Qs = require('querystring');
var OAuth = require('oauth');
var http = require('request-promise-json');
var Configuration = require('../../models/configuration');
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
    return makeErrorPromise({
      statusCode: 500,
      message: 'Unable to connect to Telldus endpoint. Check your configuration'
    });
  } else {
    return makeErrorPromise(err);
  }
}

/**
 * Make the actual api call to telldus.
 * @param path
 * @param params
 * @returns {*}
 */
function apiCall(path, params) {
  return getConfig().then(function (config) {

    if (!config.telldus.enabled) {
      return makeErrorPromise({serviceDisabled: true, message: 'Telldus not enabled'});
    }

    var url = config.telldus.endpoint + path;
    var oauth = new OAuth.OAuth(null, null,
      config.telldus.publicKey,
      config.telldus.privateKey, '1.0', null, 'HMAC-SHA1');
    var oauthParameters = oauth._prepareParameters(
      config.telldus.accessToken,
      config.telldus.accessTokenSecret, 'GET', url, params);
    var messageParameters = {};
    oauthParameters.forEach(function (params) {
      messageParameters[params[0]] = params[1];
    });

    return http.get(url + '?' + Qs.stringify(messageParameters)).catch(errorHandler);
  });
}


function makeErrorPromise(msg) {
  var deferred = Q.defer();
  deferred.reject(msg);
  return deferred.promise;
}


/**
 * Get all devices.
 * @returns {*}
 */
exports.devices = function () {
  return apiCall('devices/list',
    {supportedMethods: METHODS})
    .then(function (response) {
      return response.device.filter(function (device) {
        return device.type === 'device';
      })
    });
};

/**
 * Get all groups.
 * @returns {*}
 */
exports.groups = function () {
  return apiCall('devices/list',
    {supportedMethods: METHODS})
    .then(function (response) {
      return response.device.filter(function (device) {
        return device.type === 'group';
      })
    });
};

/**
 * Get a single device.
 * @param id
 * @returns {*}
 */
exports.device = function (id) {
  return apiCall('device/info',
    {supportedMethods: METHODS, id: id});
};

/**
 * Get all sensors.
 * @returns {*}
 */
exports.sensors = function () {
  return apiCall('sensors/list',
    {supportedMethods: TELLSTICK_TEMPERATURE})
    .then(function (response) {
      return response.sensor;
    });
};

/**
 * Get a single sensor.
 * @param id
 * @returns {*}
 */
exports.sensor = function (id) {
  return apiCall('sensor/info',
    {supportedMethods: TELLSTICK_TEMPERATURE, id: id});
};

/**
 * Turn a device on.
 * @param id
 * @returns {*}
 */
exports.turnOn = function (id) {
  return apiCall('device/turnOn',
    {supportedMethods: METHODS, id: id});
};

/**
 * Turn a device off.
 * @param id
 * @returns {*}
 */
exports.turnOff = function (id) {
  return apiCall('device/turnOff',
    {supportedMethods: METHODS, id: id});
};

/**
 * Make device go up.
 * @param id
 * @returns {*}
 */
exports.goUp = function (id) {
  return apiCall('device/up',
    {supportedMethods: METHODS, id: id});
};

/**
 * Make device go down.
 * @param id
 * @returns {*}
 */
exports.goDown = function (id) {
  return apiCall('device/down',
    {supportedMethods: METHODS, id: id});
};
