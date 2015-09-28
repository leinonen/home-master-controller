/**
 * Master API - Control everything! :D
 *
 * @type {exports}
 * @author Peter Leinonen
 */
var Promise = require('./util/promise');
var ApiWrapper = require('./api/api-wrapper');
var Group = require('../models/group');
var Schedule = require('../models/schedule');
var Bus = require('./bus');
var Events = require('./events');

// API Implementations
var TelldusAPI = require('./api/telldus');
var HueAPI = require('./api/hue');
var ZWaveAPI = require('./api/zwave');
var GroupAPI = require('../models/group');
var GenericAPI = require('./api/generic');
var Wrapper = new ApiWrapper(TelldusAPI, HueAPI, ZWaveAPI, GenericAPI, GroupAPI);

exports.sensors = () => Wrapper.sensors().catch(errorHandler);
exports.sensor = (id, type) => Wrapper.sensor(id, type).catch(errorHandler);
exports.groups = () => Wrapper.groups().catch(errorHandler);
exports.group = (id, type) => Wrapper.group(id, type).catch(errorHandler);
exports.devices = () => Wrapper.devices().catch(errorHandler);
exports.device = (id, type) => Wrapper.device(id, type).catch(errorHandler);
exports.groupDevices = (id, type) =>  Wrapper.groupDevices(id, type).catch(errorHandler);
exports.groupState = (id) =>  Wrapper.groupState(id).catch(errorHandler);
exports.createGenericGroup = (group) =>  Wrapper.createGenericGroup(group).catch(errorHandler);
exports.updateGenericGroup = (id, group) => Wrapper.updateGenericGroup(id, group).catch(errorHandler);
exports.removeGenericGroup = (id) =>  Wrapper.removeGenericGroup(id).catch(errorHandler);
exports.control = (id, params) => Wrapper.control(id, params).catch(errorHandler);
exports.schedule = (id) => Schedule.findById(id);
exports.schedules = () => Schedule.findAll();
exports.createSchedule = (schedule) => {
  var sch = new Schedule(schedule);
  sch.save();
  Bus.emit(Events.UPDATE_SCHEDULER);
  return Promise.resolve(sch);
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
    Bus.emit(Events.UPDATE_SCHEDULER);
    return schedule;
  });


exports.deleteSchedule = (id) => Schedule.findById(id)
  .then(schedule => {
    schedule.remove();
    Bus.emit(Events.UPDATE_SCHEDULER);
    return {};
  });



/**
 * Error handler
 * @param error
 * @returns {Promise.promise|*}
 */
function errorHandler(error) {
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
  return Promise.reject(msg);
}
