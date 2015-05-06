var Qs = require('querystring');
var OAuth = require('oauth');
var http = require('request-promise-json');
var config = require('./config');

function doCall(path, params) {
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
  return doCall('devices/list', {supportedMethods: 1}).then(function(response){
    return response.device;
  });
};

exports.listSensors = function () {
  return doCall('sensors/list', {supportedMethods: 1}).then(function(response){
    return response.sensor;
  });
};

exports.getSensor = function(id) {
  return doCall('sensor/info', {supportedMethods: 1, id: id});
};
