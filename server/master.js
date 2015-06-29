/**
 * Master API - Control everything! :D
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Q = require('q');
var Wrapper = require('./api/api-wrapper');
var Group = require('../models/group');
var Schedule = require('../models/schedule');
//var events = require('events');
//var eventEmitter = new events.EventEmitter();
var Bus = require('./bus');

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
  return Wrapper.sensor(id, type).catch(errorHandler);
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

exports.createGenericGroup = function (group) {
  return Wrapper.createGenericGroup(group).catch(errorHandler);
};

exports.updateGenericGroup = function (id, group) {
  return Wrapper.updateGenericGroup(id, group).catch(errorHandler);
};

exports.removeGenericGroup = function (id) {
  return Wrapper.removeGenericGroup(id).catch(errorHandler);
};

/**
 * Control a device or group.
 * @param id
 * @param params
 */
exports.control = function (id, params) {
  return Wrapper.control(id, params).catch(errorHandler);
};


exports.schedule = function (id) {
  return Schedule.findById(id);
};

exports.schedules = function () {
  return Schedule.findAll();
};

exports.createSchedule = function (schedule) {
  var sch = new Schedule(schedule);
  sch.save();
  Bus.emit('SchedulerUpdate');
  var def = Q.defer();
  def.resolve(sch);
  return def.promise;
};

exports.updateSchedule = function (id, sch) {
  return Schedule
    .findById(id)
    .then(function (schedule) {
      schedule.name = sch.name;
      schedule.action = sch.action;
      schedule.active = sch.active;
      schedule.time = sch.time;
      schedule.random = sch.random;
      schedule.weekdays = sch.weekdays;
      schedule.items = sch.items;
      schedule.save();
      console.log('schedule updated');
      Bus.emit('SchedulerUpdate');
      return schedule;
    });
};

exports.deleteSchedule = function (id) {
  return Schedule
    .findById(id)
    .then(function (schedule) {
    schedule.remove();
    return {};
  });
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

  if (msg.statusCode === 500) {
    msg.message = error.message;
  } else if (msg.statusCode === 404) {

    if (error.hasOwnProperty('request')) {
      msg.message = 'Not found! ' + error.request.url;
    } else {
      msg.message = 'Not found!';
    }
  } else {
    msg.message = error;
  }

  deferred.reject(msg);
  return deferred.promise;
}
