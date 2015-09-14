/**
 * Philips Hue API wrapper
 * @type {exports}
 * @author Peter Leinonen
 */

var Promise = require('../util/promise');
var http = require('request-promise-json');
var Configuration = require('../../models/configuration');


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
}

var doGet = (path) => Configuration.get().then(config => {
  if (!config.hue.enabled) {
    return Promise.reject({serviceDisabled: true, message: 'Hue not enabled'});
  }
  return http.get(config.hue.endpoint + path).catch(errorHandler);
});


var doPut = (path, data) => Configuration.get().then(config => {
  if (!config.hue.enabled) {
    return Promise.reject({serviceDisabled: true, message: 'Hue not enabled'});
  }
  return http.put(config.hue.endpoint + path, data).catch(errorHandler);
});


/**
 * Get all groups.
 * @returns {*}
 */
exports.groups = () =>
  doGet('/groups')
  .then(groups => Object.keys(groups)
    .map(key => {
      var group = groups[key];
      group.id = key;
      return group;
    })
  );


/**
 * Get a group.
 * @param id
 * @returns {*}
 */
exports.group = (id) =>
  doGet('/groups/' + id)
  .then(group => {
    group.id = id; // Must have the id!
    return group;
  });


/**
 * Get all the lights.
 * @returns {*}
 */
exports.lights = () =>
  doGet('/lights')
  .then(lights => {
    // crude error handling, hue not returning http error codes!
    if (lights.length === 1 && lights[0].hasOwnProperty('error')) {
      //console.log('hue error: ' + lights[0].error.description);
      return Promise.reject({
        statusCode: 500,
        message: 'Hue api - ' + lights[0].error.description + '. Check your configuration'
      });
    } else {
      return Object.keys(lights).map(key => {
        var light = lights[key];
        light.id = key;
        return light;
      });
    }
  });


/**
 * Get a single light.
 * @param id
 * @returns {*}
 */
exports.light = (id) =>
  doGet('/lights/' + id)
  .then(light => {
    light.id = id; // Must have the id!
    return light;
  });

/**
 * Set the state of a light.
 * @param id
 * @param state
 * @returns {*}
 */
exports.setLightState = (id, state) =>
  doPut('/lights/' + id + '/state', state)
  .then(response => {
    // TODO: Make a proper response Transformer
    console.log(response);
    return response;
  });


// var action = {bri: Number(bri)};

/**
 * Set the state for a group.
 * @param id
 * @param action
 * @returns {*}
 */
exports.setGroupAction = (id, action) =>
  doPut('/groups/' + id + '/action', action)
  .then(response => {
    // TODO: Make a proper response Transformer
    console.log(response);
    return response;
  });
