/**
 * Philips Hue API wrapper
 * @type {exports}
 * @author Peter Leinonen
 */

var http = require('request-promise-json');
var Configuration = require('../../models/configuration');


function doGet(path) {
  return Configuration.get().then(function (config) {
    return http.get(config.hue.endpoint + path);
  });
}

function doPut(path, data) {
  return Configuration.get().then(function (config) {
    return http.put(config.hue.endpoint + path, data);
  });
}

/**
 * Get all groups.
 * @returns {*}
 */
exports.getGroups = function () {
  return doGet('/groups')
    .then(function (groups) {
      return Object.keys(groups).map(function (key) {
        var group = groups[key];
        group.id = key;
        return group;
      });
    });
};

/**
 * Get a group.
 * @param id
 * @returns {*}
 */
exports.getGroup = function (id) {
  return doGet('/groups/' + id)
    .then(function (group) {
      group.id = id; // Must have the id!
      console.log(group);
      return group;
    });
};

/**
 * Get all the lights.
 * @returns {*}
 */
exports.getLights = function () {
  return doGet('/lights')
    .then(function (lights) {
      // crude error handling, hue not returning http error codes!
      if (lights.length === 1 && lights[0].hasOwnProperty('error')) {
        console.log('hue error: ' + lights[0].error.description);
        return [];
      } else {
        return Object.keys(lights).map(function (key) {
          var light = lights[key];
          light.id = key;
          return light;
        });
      }
    });
};

/**
 * Get a single light.
 * @param id
 * @returns {*}
 */
exports.getLight = function (id) {
  return doGet('/lights/' + id)
    .then(function (light) {
      light.id = id; // Must have the id!
      console.log(light);
      return light;
    });
};

/**
 * Set the state of a light.
 * @param id
 * @param state
 * @returns {*}
 */
exports.setLightState = function (id, state) {
  return doPut('/lights/' + id + '/state', state)
    .then(function (response) {
      console.log(response);
      return response;
    });
};

// var action = {bri: Number(bri)};

/**
 * Set the state for a group.
 * @param id
 * @param action
 * @returns {*}
 */
exports.setGroupAction = function (id, action) {
  return doPut('/groups/' + id + '/action', action)
    .then(function (response) {
      console.log(response);
      return response;
    });
};
