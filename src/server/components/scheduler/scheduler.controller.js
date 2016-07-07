'use strict';

var Schedule = require('./schedule.model');
var Events = require('./events');
var Bus = require('../../util/bus');
var Sun = require('./sun');
var ErrorHandler = require('../../util/errorhandler');

var getSchedule = (id) => Schedule.findById(id);

var getSchedules = () => Schedule.findAll();

var updateScheduler = () => {
  setTimeout(() => {
    console.log('timed out event');
    Bus.emit(Events.UPDATE_SCHEDULER);
  }, 1000);
}

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
  getSchedule(req.params.id)
  .then(schedule => res.json(schedule))
  .catch(err => ErrorHandler.handle(res, err));

exports.schedules = (req, res) =>
  getSchedules()
  .then(schedules => res.json(schedules))
  .catch(err => ErrorHandler.handle(res, err));

exports.createSchedule = (req, res) =>
  createSchedule(req.body)
  .then(schedule => res.json(schedule))
  .catch(err => ErrorHandler.handle(res, err));

exports.updateSchedule = (req, res) =>
  updateSchedule(req.params.id, req.body)
  .then(schedule => res.json(schedule))
  .catch(err => ErrorHandler.handle(res, err));

exports.deleteSchedule = (req, res) =>
  deleteSchedule(req.params.id)
  .then(response => res.json(response))
  .catch(err => ErrorHandler.handle(res, err));

exports.sun = (req, res) => {
  res.json({
    sunset: Sun.sunsetTime().format('HH:mm:ss'),
    sunrise: Sun.sunriseTime().format('HH:mm:ss')
  });
};