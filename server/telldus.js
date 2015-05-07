var Qs = require('querystring');
var OAuth = require('oauth');
var http = require('request-promise-json');
var config = require('./config');

function apiCall(path, params) {
  var url = config.endpoint + path;
  var oauth = new OAuth.OAuth(null, null, config.publicKey, config.privateKey, '1.0', null, 'HMAC-SHA1');
  var oauthParameters = oauth._prepareParameters(config.accessToken, config.accessTokenSecret, 'GET', url, params);
  var messageParameters = {};
  oauthParameters.forEach(function (params) {
    messageParameters[params[0]] = params[1];
  });
  return http.get(url + '?' + Qs.stringify(messageParameters));
};


exports.listDevices = function() {
  return apiCall('devices/list', {supportedMethods: 1}).then(function(response){
    return response.device;
  });
};

exports.getDevice = function(id) {
  return apiCall('device/info', {supportedMethods: 1, id: id});
};

exports.listSensors = function () {
  return apiCall('sensors/list', {supportedMethods: 1}).then(function(response){
    return response.sensor;
  });
};

exports.getSensor = function(id) {
  return apiCall('sensor/info', {supportedMethods: 1, id: id});
};

exports.turnOn = function(id) {
  return apiCall('device/turnOn', {supportedMethods: 1, id: id});
};

exports.turnOff = function(id) {
  return apiCall('device/turnOff', {supportedMethods: 1, id: id});
};
