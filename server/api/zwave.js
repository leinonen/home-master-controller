var http = require('request-promise-json');
var Configuration = require('../../models/configuration');

function doGet(path) {
  return Configuration.get().then(function (config) {
    return http.get(config.zwave.endpoint + path);
  });

}

exports.devices = function () {
  return doGet('/ZAutomation/api/v1/devices').then(function(response){
    return response.data.devices.filter(function(device){
      return device.deviceType === 'switchBinary';
    });
  });
};

exports.sensors = function () {
  return doGet('/ZAutomation/api/v1/devices').then(function(response){
    return response.data.devices.filter(function(device){
      return device.deviceType === 'sensorMultilevel'
    });
  });
};
