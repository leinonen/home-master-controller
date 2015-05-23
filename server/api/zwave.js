/**
 * Z-Wave / Razberry API Wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var http = require('request-promise-json');
var Configuration = require('../../models/configuration');

function doGet(path) {
  return Configuration.get().then(function (config) {
    return http.get(config.zwave.endpoint + path);
  });

}

exports.devices = function () {
  return doGet('/ZAutomation/api/v1/devices')
    .then(function (response) {
      return response.data.devices.filter(function (device) {
        return device.deviceType === 'switchBinary';
      });
    });
};

exports.device = function (id) {
  return doGet('/ZAutomation/api/v1/devices/' + id)
    .then(function (response) {
      return response.data;
    });
};

exports.setOn = function (id) {
  console.log('Turn zwave device ' + id + ' on');
  return doGet('/ZAutomation/api/v1/devices/' + id + '/command/on')
    .then(function (response) {
      console.log(response);
      return {
        status: response.message
      };
    });
};

exports.setOff = function (id) {
  console.log('Turn zwave device ' + id + ' off');
  return doGet('/ZAutomation/api/v1/devices/' + id + '/command/off')
    .then(function (response) {
      console.log(response);
      return {
        status: response.message
      };
    });
};

exports.sensors = function () {
  return doGet('/ZAutomation/api/v1/devices')
    .then(function (response) {
      return response.data.devices.filter(function (device) {
        return device.deviceType === 'sensorMultilevel'
      });
    });
};
