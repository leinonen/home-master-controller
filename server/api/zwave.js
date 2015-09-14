'use strict';

/**
 * Z-Wave / Razberry API Wrapper.
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Promise = require('../util/promise');
var http = require('request-promise-json');
var Configuration = require('../../models/configuration');
var sessionCookie = undefined;

const ZWAVE_DEVICES = '/ZAutomation/api/v1/devices';

var getFormData = (config) => {
  return {
    form: true,
    login: config.username,
    password: config.password,
    keepme: false,
    default_ui: 1
  };
}

var zwave_login = (config) => http.request({
    method: 'POST',
    url: config.endpoint + '/ZAutomation/api/v1/login',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: getFormData(config)
  })
  .then(res => res.data.sid)
  .catch(err => Promise.reject(err));


var zwave_get = (url) => {
  // console.log('zwave_get ' + url+ ' sessionCookie: ' + sessionCookie);
  return http.request({
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': 'ZWAYSession=' + sessionCookie
    },
    url: url
  })
  .then(res => {
    if (res.code === 200){
      return res;
    } else {
      return Promise.reject('Some kind of error');
    }
  })
  .catch(err => Promise.reject(err));
}

var zwave_login_get = (config, uri) => {
  if (sessionCookie === undefined) {
    return zwave_login(config)
      .then(sid => {
        sessionCookie = sid;
        return zwave_get(config.endpoint + uri);
      });
  } else {
    return zwave_get(config.endpoint + uri);
  }
}

var errorHandler = (err) => {
  console.log(err);
  if (err.code === 'ECONNREFUSED' ||
    err.code === 'ENETUNREACH' ||
    err.code === 'ETIMEDOUT') {
    return Promise.reject({
      statusCode: 500,
      message: 'Unable to connect to Z-Wave endpoint. Check your configuration'
    });
  } else {
    return Promise.reject(err);
  }
}

var doGet = (path) => Configuration.get()
  .then(config => {
    if (!config.zwave.enabled) {
      return Promise.reject({serviceDisabled: true, message: 'ZWave not enabled'});
    }
    return zwave_login_get(config.zwave, path);
  })
  .catch(errorHandler);

var isBinarySwitch = (device) => device.deviceType === 'switchBinary';
var isSensorMultilevel = (device) => device.deviceType === 'sensorMultilevel';

exports.devices = () => doGet(ZWAVE_DEVICES)
  .then(res => res.data.devices.filter(isBinarySwitch));

exports.device = (id) => doGet(ZWAVE_DEVICES + '/' + id)
  .then(res => res.data);

exports.setOn = (id) => doGet(ZWAVE_DEVICES + '/' + id + '/command/on')
  .then(res => {
    console.log(res.message);
    return {
      status: res.message
    };
  });

exports.setOff = (id) =>
  doGet(ZWAVE_DEVICES + '/' + id + '/command/off')
  .then(res => {
    console.log(res.message);
    return {
      status: res.message
    };
  });


exports.sensors = () => doGet(ZWAVE_DEVICES)
  .then(res => res.data.devices.filter(isSensorMultilevel));

exports.sensor = (id) => doGet(ZWAVE_DEVICES + '/' + id)
  .then(res => res.data);
