'use strict';
var auth = require('../../components/auth/auth.service');
var serveJson = require('../../lib/json-controller');
var Schedule = require('./schedule.model');
var Events = require('./events');
var Bus = require('../../util/bus');
var Sun = require('./sun');

var updateScheduler = () => {
  setTimeout(() => {
    Bus.emit(Events.UPDATE_SCHEDULER);
  }, 1000);
};

const createSchedule = (schedule) => {
  var sch = new Schedule(schedule);
  sch.save();
  updateScheduler();
  return Promise.resolve(sch);
};

const updateSchedule = (id, sch) => Schedule
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

module.exports = require('express').Router()

  .get('/schedules', (req, res) => serveJson(
    Schedule.findAll(), req, res
  ))
  .post('/schedules', auth.isAuthenticated(), (req, res) => serveJson(
    createSchedule(req.body), req, res
  ))
  .get('/schedules/:id', (req, res) => serveJson(
    Schedule.findById(req.params.id), req, res
  ))
  .put('/schedules/:id', auth.isAuthenticated(), (req, res) => serveJson(
    updateSchedule(req.params.id, req.body), req, res
  ))
  .delete('/schedules/:id', auth.isAuthenticated(), (req, res) =>
    serveJson(
      Schedule.findById(req.params.id)
        .then(schedule => {
          schedule.remove();
          updateScheduler();
          return {};
        }), req, res
    ))
  .get('/sun', (req, res) => {
    res.json({
      sunset: Sun.sunsetTime().format('HH:mm:ss'),
      sunrise: Sun.sunriseTime().format('HH:mm:ss')
    });
  });

