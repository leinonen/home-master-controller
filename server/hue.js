var http = require('request-promise-json');
var config = require('./config');

exports.getGroups = function () {
  return http.get(config.hueEndpoind + '/groups').then(function (groups) {
    return Object.keys(groups).map(function (key) {
      var group = groups[key];
      group.id = key;
      return group;
    });
  });
};

exports.getLights = function () {
  return http.get(config.hueEndpoind + '/lights').then(function (lights) {
    return Object.keys(lights).map(function (key) {
      var light = lights[key];
      light.id = key;
      return light;
    });
  });
};

exports.setLightState = function (id, state) {
  return http.put(config.hueEndpoind + '/lights/' + id + '/state', state).then(function (response) {
    console.log(response);
    return response;
  });
};

exports.setGroupAction = function (id, action) {
  return http.put(config.hueEndpoind + '/groups/' + id + '/action', action).then(function (response) {
    console.log(response);
    return response;
  });
};
