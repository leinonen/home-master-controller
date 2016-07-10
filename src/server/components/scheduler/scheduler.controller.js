'use strict';

var Schedule = require('./schedule.model');
var Events = require('./events');
var Bus = require('../../util/bus');
var Sun = require('./sun');
//var ErrorHandler = require('../../util/errorhandler');
var serveJson = require('../../lib/json-controller');

var getSchedule = (id) => Schedule.findById(id);

var getSchedules = () => Schedule.findAll();

var updateScheduler = () => {
  setTimeout(() => {
    Bus.emit(Events.UPDATE_SCHEDULER);
  }, 1000);
};

var createSchedule = (schedule) => {
  var sch = new Schedule(schedule);
  sch.save();
  updateScheduler();
  return Promise.resolve(sch);
};

var updateSchedule = (id, sch) => Schedule
  .findById(id)
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
    updateScheduler();
    return schedule;
  });


var deleteSchedule = (id) =>
  Schedule.findById(id)
  .then(schedule => {
    schedule.remove();
    updateScheduler();
    return {};
  });

exports.schedule = (req, res) =>
  serveJson(getSchedule(req.params.id), req, res);

exports.schedules = (req, res) =>
  serveJson(getSchedules(), req, res);

exports.createSchedule = (req, res) =>
  serveJson(createSchedule(req.body), req, res);

exports.updateSchedule = (req, res) =>
  serveJson(updateSchedule(req.params.id, req.body), req, res);

exports.deleteSchedule = (req, res) =>
  serveJson(deleteSchedule(req.params.id), req, res);

exports.sun = (req, res) => {
  res.json({
    sunset: Sun.sunsetTime().format('HH:mm:ss'),
    sunrise: Sun.sunriseTime().format('HH:mm:ss')
  });
};