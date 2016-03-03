'use strict';
var Promise = require('../../util/promise');
var DeviceActions = require('../device-actions');
var DeviceTypes = require('../device-types');
var Configuration = require('../../components/configuration/configuration.model.js');
var Transformer = require('./hue-transformer');
var ServiceHandler = require('../../lib/service.handler');
var HueConnector = require('./hue-connector');
var winston = require('winston');

exports.transformDevice = Transformer.HueDevice;
exports.transformDevices = Transformer.HueDevices;
exports.transformGroup = Transformer.HueGroup;
exports.transformGroups = Transformer.HueGroups;


var doGet = (path) =>
  Configuration.get()
  .then(config => {
    if (!config.hue.enabled) {
      return ServiceHandler.serviceDisabled('Hue not enabled');
    }
    return HueConnector.get(config.hue, path);
  });


var doPut = (path, data) =>
  Configuration.get()
  .then(config => {
    if (!config.hue.enabled) {
      return ServiceHandler.serviceDisabled('Hue not enabled');
    }
    return HueConnector.put(config.hue, path, data);
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
      winston.error('HUE: ' + lights[0].error.description);
      return Promise.reject({
        statusCode: 500,
        message: 'HUE:' + lights[0].error.description + '. Check your configuration'
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
var setLightState = exports.setLightState = (id, state) =>
  doPut('/lights/' + id + '/state', state)
  .then(response => {
    if (response[0].error) {
      return Promise.reject({
        statusCode: 500,
        message: response[0].error.description
      });
    } else {
      winston.info('HUE: Operation successful');
      return response;
    }
  });


// var action = {bri: Number(bri)};

/**
 * Set the state for a group.
 * @param id
 * @param action
 * @returns {*}
 */
var setGroupAction = exports.setGroupAction = (id, action) =>
  doPut('/groups/' + id + '/action', action)
  .then(response => {
      if (response[0].error) {
        return Promise.reject({statusCode: 500,
          message: response[0].error.description
        });
      } else {
        winston.info('HUE: Operation successful');
        return response;
      }
  });


var createHueParams = (params) => {
  var hueParams = {};
  switch (params.action) {
    case DeviceActions.ACTION_ON:
      hueParams = {on: true};
      break;

    case DeviceActions.ACTION_OFF:
      hueParams = {on: false};
      break;

    case 'colorloop-on':
      hueParams = {effect: 'colorloop'};
      break;

    case 'colorloop-off':
      hueParams = {effect: 'none'};
      break;

    case 'bri':
      hueParams = {bri: Number(params.value)};
      break;

    case 'sat':
      hueParams = {sat: Number(params.value)};
      break;

    case 'hue':
      hueParams = {hue: Number(params.value)};
      break;
  }
  return hueParams;
};

exports.control = (id, params) => {
  var hueParams = createHueParams(params);
  switch (params.type) {
    case DeviceTypes.HUE_DEVICE:
      return setLightState(id, hueParams);

    case DeviceTypes.HUE_GROUP:
      return setGroupAction(id, hueParams);

    default:
      return Promise.reject('controlHue: Unsupported type ' + params.type);
  }
};
