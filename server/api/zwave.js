/**
 * Z-Wave / Razberry API Wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Q = require('q');
var http = require('request-promise-json');
var Configuration = require('../../models/configuration');
var sessionCookie = undefined;

function zwave_login(config) {
  return http.request({
    method: 'POST',
    url: config.endpoint + '/ZAutomation/api/v1/login',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      form: true,
      login: config.username,
      password: config.password,
      keepme: false,
      default_ui: 1
    }
  }).then(function(response) {
    return response.data.sid;
  })
  .catch(function(err) {
    return makeErrorPromise(err);
  });
}

function zwave_get(url) {
  // console.log('zwave_get ' + url+ ' sessionCookie: ' + sessionCookie);
  return http.request({
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': 'ZWAYSession=' + sessionCookie
    },
    url: url
  })
  .then(function(response) {
    if (response.code === 200){
      return response;
    } else {
      return makeErrorPromise('Some kind of error');
    }
  })
  .catch(function(err) {
    return makeErrorPromise(err);
  });
}

function zwave_login_get(config, uri) {
  if (sessionCookie === undefined) {
    return zwave_login(config)
    .then(function(sid) {
      sessionCookie = sid;
      return zwave_get(config.endpoint + uri);
    });
  } else {
    return zwave_get(config.endpoint + uri);
  }
}

function errorHandler(err) {
  console.log(err);
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
    return zwave_login_get(config.zwave, path);
  }).catch(errorHandler);
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
