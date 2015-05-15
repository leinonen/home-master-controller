/**
 * Philips Hue API wrapper
 * @type {exports}
 * @author Peter Leinonen
 */

var http = require('request-promise-json');
var Configuration = require('../../models/configuration');


function getConfig() {
  return Configuration.findOne().execQ();
}

/**
 * Get all groups.
 * @returns {*}
 */
exports.getGroups = function () {
  return getConfig().then(function (config) {
    return http.get(config.hue.endpoint + '/groups').then(function (groups) {
      return Object.keys(groups).map(function (key) {
        var group = groups[key];
        group.id = key;
        return group;
      });
    });
  });

};

/**
 * Get all the lights.
 * @returns {*}
 */
exports.getLights = function () {
  return getConfig().then(function (config) {
    return http.get(config.hue.endpoint + '/lights').then(function (lights) {

      // crude error handling :)
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
  });
};

/**
 * Get a single light.
 * @param id
 * @returns {*}
 */
exports.getLight = function (id) {
  return getConfig().then(function (config) {
    return http.get(config.hue.endpoint + '/lights/' + id).then(function (light) {
      return light;
    });
  });
};

/**
 * Set the state of a light.
 * @param id
 * @param state
 * @returns {*}
 */
exports.setLightState = function (id, state) {
  return getConfig().then(function (config) {
    return http.put(config.hue.endpoint + '/lights/' + id + '/state', state).then(function (response) {
      console.log(response);
      return response;
    });
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
  return getConfig().then(function (config) {
    return http.put(config.hue.endpoint + '/groups/' + id + '/action', action).then(function (response) {
      console.log(response);
      return response;
    });
  });
};
