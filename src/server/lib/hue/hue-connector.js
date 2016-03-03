'use strict';

var http = require('request-promise-json');
var Promise = require('../../util/promise');

function HueConnector() {
}

var errorHandler = (err) => {
  if (err.code === 'ECONNREFUSED' ||
    err.code === 'ENETUNREACH' ||
    err.code === 'ETIMEDOUT') {
    return Promise.reject({
      statusCode: 500,
      message: 'Unable to connect to Hue endpoint. Check your configuration'
    });
  } else {
    return Promise.reject(err);
  }
};

HueConnector.prototype.get = function(config, path) {
  return http.get(config.endpoint + path).catch(errorHandler);
};

HueConnector.prototype.put = function(config, path, data) {
  return http.put(config.endpoint + path, data).catch(errorHandler);
};

module.exports = new HueConnector();