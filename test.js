var http = require('request-promise-json');
var Q = require('q');

var endpoint = 'http://192.168.1.107:8083';
var sessionCookie = undefined;
var credentials = {
  username: 'admin',
  password: 'admin'
};

function makeErrorPromise(msg){
  var def = Q.defer();
  def.reject(msg);
  return def.promise;
}

function zwave_login() {
  return http.request({
    method: 'POST',
    url: endpoint + '/ZAutomation/api/v1/login',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      form: true,
      login: credentials.username,
      password: credentials.password,
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

function zwave_get(uri) {
  return http.request({
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': 'ZWAYSession=' + sessionCookie
    },
    url: endpoint + uri
  })
  .then(function(response) {
    if (response.code === 200){
      return response.data.devices;
    } else {
      return makeErrorPromise('Some kind of error');
    }
  })
  .catch(function(err) {
    return makeErrorPromise(err);
  });
}

function zwave_login_get(uri) {
  if (sessionCookie === undefined) {
    return zwave_login()
    .then(function(sid) {
      sessionCookie = sid;
      return zwave_get(uri);
    });
  } else {
    return zwave_get(uri);
  }
}

function getDevices() {
  return zwave_login_get('/ZAutomation/api/v1/devices');
}

getDevices()
  .then(function(devices) {
    devices.filter(function(item){
      return item.deviceType === 'switchBinary';
    }).forEach(function(item) {
      console.log(item);
    });
  })
  .catch(function(err) {
    if (err.response.code === 401) {
      console.log(err.response.error);
    } else {
      console.log('some other error');
      console.log(err);
    }
  });
