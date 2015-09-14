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
exports.sensors = () => Wrapper.sensors().catch(errorHandler);

/**
 * Get a specific sensor.
 * @param id
 * @param type
 * @returns {*}
 */
exports.sensor = (id, type) => Wrapper.sensor(id, type).catch(errorHandler);

/**
 * Get all groups.
 */
exports.groups = () => Wrapper.groups().catch(errorHandler);

/**
 * Get a single group.
 * @param id
 * @param type
 * @returns {*}
 */
exports.group = (id, type) => Wrapper.group(id, type).catch(errorHandler);

/**
 * Get all devices.
 */
exports.devices = () => Wrapper.devices().catch(errorHandler);

/**
 * Get a specific device.
 * @param id
 * @param type
 * @returns {*}
 */
exports.device = (id, type) =>
  Wrapper.device(id, type).catch(errorHandler);

/**
 * Get all devices for a specific group.
 * @param id
 * @param type
 * @returns {*}
 */
exports.groupDevices = (id, type) =>
  Wrapper.groupDevices(id, type).catch(errorHandler);

/**
 * Get the state of a group
 * @param id
 * @returns {*}
 */
exports.groupState = (id) =>
  Wrapper.groupState(id).catch(errorHandler);

exports.createGenericGroup = (group) =>
  Wrapper.createGenericGroup(group).catch(errorHandler);

exports.updateGenericGroup = (id, group) =>
  Wrapper.updateGenericGroup(id, group).catch(errorHandler);

exports.removeGenericGroup = (id) =>
  Wrapper.removeGenericGroup(id).catch(errorHandler);

/**
 * Control a device or group.
 * @param id
 * @param params
 */
exports.control = (id, params) =>
  Wrapper.control(id, params).catch(errorHandler);

exports.schedule = (id) => Schedule.findById(id);

exports.schedules = () => Schedule.findAll();

exports.createSchedule = (schedule) => {
  var sch = new Schedule(schedule);
  sch.save();
  Bus.emit('SchedulerUpdate');
  var def = Q.defer();
  def.resolve(sch);
  return def.promise;
};

exports.updateSchedule = (id, sch) => Schedule.findById(id)
  .then(schedule => {
    schedule.name = sch.name;
    schedule.action = sch.action;
    schedule.active = sch.active;
    schedule.time = sch.time;
    // sunset and sunrise are booleans
    schedule.sunset = sch.sunset;
    schedule.sunrise = sch.sunrise;
    schedule.random = sch.random;
    schedule.weekdays = sch.weekdays;
    schedule.items = sch.items;
    schedule.save();
    console.log('schedule updated');
    Bus.emit('SchedulerUpdate');
    return schedule;
  });


exports.deleteSchedule = (id) => Schedule.findById(id)
  .then(schedule => {
    schedule.remove();
    Bus.emit('SchedulerUpdate');
    return {};
  });



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
