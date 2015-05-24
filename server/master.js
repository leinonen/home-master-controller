/**
 * Master API - Control everything! :D
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Q = require('q');
var Wrapper = require('./api/api-wrapper');
var Group = require('../models/group');

/**
 * Get all sensors.
 * @returns {*}
 */
exports.sensors = function () {
  return Wrapper.sensors().catch(errorHandler);
};

/**
 * Get a specific sensor.
 * @param id
 * @param type
 * @returns {*}
 */
exports.sensor = function (id, type) {
  return Wrapper.sensor(id, type);
};


/**
 * Get all groups.
 */
exports.groups = function () {
  return Wrapper.groups().catch(errorHandler);
};

/**
 * Get a single group.
 * @param id
 * @param type
 * @returns {*}
 */
exports.group = function (id, type) {
  return Wrapper.group(id, type).catch(errorHandler);
};


/**
 * Get all devices.
 */
exports.devices = function () {
  return Wrapper.devices().catch(errorHandler);
};

/**
 * Get a specific device.
 * @param id
 * @param type
 * @returns {*}
 */
exports.device = function (id, type) {
  return Wrapper.device(id, type).catch(errorHandler);
};

/**
 * Get all devices for a specific group.
 * @param id
 * @param type
 * @returns {*}
 */
exports.groupDevices = function (id, type) {
  return Wrapper.groupDevices(id, type).catch(errorHandler);
};

/**
 * Get the state of a group
 * @param id
 * @returns {*}
 */
exports.groupState = function (id) {
  return Wrapper.groupState(id).catch(errorHandler);
};

exports.createGenericGroup = function(group){
  return Wrapper.createGenericGroup(group).catch(errorHandler);
};

exports.updateGenericGroup = function(id, group){
  return Wrapper.updateGenericGroup(id, group);
};

exports.removeGenericGroup = function(id){
  return Wrapper.removeGenericGroup(id);
};

/**
 * Control a device or group.
 * @param id
 * @param params
 */
exports.control = function (id, params) {
  return Wrapper.control(id, params).catch(errorHandler);
};



/**
 * Error handler
 * @param error
 * @returns {Promise.promise|*}
 */
function errorHandler(error) {
  var deferred = Q.defer();
  var msg = {};
  msg.statusCode = error.statusCode || 400;

  if (msg.statusCode === 500){
    msg.message = error.message;
  } else if (msg.statusCode === 404){
    msg.message = 'Not found!';
    if (error.hasOwnProperty('request')) {
      msg.url = error.request.url;
    }
  } else {
    msg.message = error;
  }

  deferred.reject(msg);
  return deferred.promise;
}
