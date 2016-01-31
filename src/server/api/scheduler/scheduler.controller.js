'use strict';

var Schedule = require('./schedule.model');
var Events = require('./events');
var Bus = require('../../util/bus');
var Sun = require('./sun');

var getSchedule = (id) => Schedule.findById(id);

var getSchedules = () => Schedule.findAll();

var createSchedule = (schedule) => {
  var sch = new Schedule(schedule);
  sch.save();
  Bus.emit(Events.UPDATE_SCHEDULER);
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
    Bus.emit(Events.UPDATE_SCHEDULER);
    return schedule;
  });


var deleteSchedule = (id) => Schedule
  .findById(id)
  .then(schedule => {
    schedule.remove();
    Bus.emit(Events.UPDATE_SCHEDULER);
    return {};
  });

exports.schedule = (req, res) =>
  getSchedule(req.params.id)
  .then(schedule => res.json(schedule))
  .catch(err => errorHandler(res, err));

exports.schedules = (req, res) =>
  getSchedules()
  .then(schedules => res.json(schedules))
  .catch(err => errorHandler(res, err));

exports.createSchedule = (req, res) =>
  createSchedule(req.body)
  .then(schedule => res.json(schedule))
  .catch(err => errorHandler(res, err));

exports.updateSchedule = (req, res) =>
  updateSchedule(req.params.id, req.body)
  .then(schedule => res.json(schedule))
  .catch(err => errorHandler(res, err));

exports.deleteSchedule = (req, res) =>
  deleteSchedule(req.params.id)
  .then(response => res.json(response))
  .catch(err => errorHandler(res, err));

exports.sun = (req, res) => {
  res.json({
    sunset: Sun.sunsetTime(),
    sunrise: Sun.sunriseTime()
  });
};