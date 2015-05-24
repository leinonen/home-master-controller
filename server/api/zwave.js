/**
 * Z-Wave / Razberry API Wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Q = require('q');
var http = require('request-promise-json');
var Configuration = require('../../models/configuration');


function errorHandler(err) {
  if (err.code === 'ECONNREFUSED' ||
    err.code === 'ENETUNREACH' ||
    err.code === 'ETIMEDOUT') {
    return makeErrorPromise({
      statusCode: 500,
      message: 'Unable to connect to Z-Wave endpoint. Check your configuration'
    });
  } else {
    return makeErrorPromise(err);
  }
}

function doGet(path) {
  return Configuration.get().then(function (config) {
    if (!config.zwave.enabled) {
      return makeErrorPromise({serviceDisabled: true, message: 'ZWave not enabled'});
    }
    return http.get(config.zwave.endpoint + path).catch(errorHandler);
  });
}

function makeErrorPromise(msg) {
  var deferred = Q.defer();
  deferred.reject(msg);
  return deferred.promise;
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

exports.sensor = function (id) {
  return doGet('/ZAutomation/api/v1/devices/' + id)
    .then(function (response) {
      return response.data;
    });
};
