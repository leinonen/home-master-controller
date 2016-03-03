'use strict';

var winston = require('winston');
var http = require('request-promise-json');
var Promise = require('../../util/promise');

function ZWaveConnector() {
  this.sessionCookie = '';
}

let handleZWaveResponse = (res) => {
  if (res.code === 200){
    return res;
  } else {
    return Promise.reject('Some kind of error');
  }
};

let doLogin = (config) => {
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
  })
  .then(res => res.data.sid)
  .catch(err => Promise.reject(err));
};

let doGet = (url, zwaySession) => http.request({
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': 'ZWAYSession=' + zwaySession
    },
    url: url
  })
  .then(res => handleZWaveResponse(res))
  .catch(err => Promise.reject(err));

ZWaveConnector.prototype.get = (config, uri) => {
  if (this.sessionCookie === undefined) {
    return doLogin(config)
      .then(sid => {
        this.sessionCookie = sid;
        winston.info('ZWAVE: Login successful');
        return doGet(config.endpoint + uri, this.sessionCookie);
      });
  } else {
    return doGet(config.endpoint + uri, this.sessionCookie);
  }
};

module.exports = new ZWaveConnector();
