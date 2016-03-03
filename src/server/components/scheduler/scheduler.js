'use strict';

var Sun     = require('./sun');
var Bus     = require('../../util/bus');
var Events  = require('./events');
var nconf   = require('nconf');
var winston = require('winston');

let dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function Scheduler(service) {
  let _service = service;
  let _schedulerTimerHandle = null;
  let _schedules = [];

  let start = () => {
    Bus.on(Events.UPDATE_SCHEDULER, updateScheduler);
    Bus.on(Events.SCHEDULE_TRIGGER, scheduleTrigger);
    Bus.emit(Events.UPDATE_SCHEDULER);

    _schedulerTimerHandle = setInterval(() => {
      _schedules.forEach((schedule) => {
        runSchedule(new Date(), schedule);
      });
    }, 1000);
    winston.info('SCHEDULER: Started');
  };

  let stop = () => clearInterval(_schedulerTimerHandle);

  let update = () => {
    fetchSchedules().then(schedules => {
      _schedules = schedules;
      winston.info('SCHEDULER: Refreshed');
      _schedules.forEach(s => winston.info('SCHEDULER: ' + s.name + ' -> ' + s.time));
    });
  };

  let updateScheduler = () => {
    setTimeout(update, 5); // Why must I use setTimeout?
  };

  var getSchedules   = () => _schedules;
  var fetchSchedules = () => _service.findAll();

  var runSchedule = (now, schedule) => {
    let currentDay = dayMap[now.getDay()];
    let currentTime = getTimeStamp(now);
    let offset = getRandomInt(0, schedule.random || 0);
    let scheduleTime = timeOffset(schedule.time, offset) + ':00';

    // Handle sunrise or sunset
    if (schedule.sunrise) {
      scheduleTime = Sun.sunriseTime();

    } else if (schedule.sunset) {
      scheduleTime = Sun.sunsetTime();
    }

    if (scheduleTime === currentTime) {
      Bus.emit(Events.SCHEDULE_TRIGGER, {
        schedule: schedule,
        scheduleTime: scheduleTime,
        currentDay: currentDay
      });
    }
  };

  var triggerSchedule = (schedule, scheduleTime, currentDay) => {
    winston.info('SCHEDULER: Trigger Schedule');

    schedule.weekdays.filter(wd => wd === currentDay).forEach(wd => {
      schedule.items.forEach(item => triggerDevice(item, schedule.action));
    });
  };

  let scheduleTrigger = (msg) => triggerSchedule(msg.schedule, msg.scheduleTime,  msg.currentDay);

  let triggerDevice = (item, action) => {
    Bus.emit(Events.CONTROL_DEVICE, {
      id: item.id,
      action: action,
      type: item.type
    });
    winston.info('SCHEDULER: Trigger Device -> (%s, %s, %s)', item.id, item.type, action);
  };

  // TODO: refctor this ugly hack!
  var timeOffset = (time, offsetMinutes) => {
    let d = new Date();
    d.setHours(time.substring(0, 2));
    d.setMinutes(time.substring(3, 5));
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toString().substring(16, 21);
  };

  let getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  let getTimeStamp = (date) => date.toString().substring(16, 24);

  return {
    stop:            stop,
    start:           start,
    timeOffset:      timeOffset,
    runSchedule:     runSchedule,
    getSchedules:    getSchedules,
    getTimeStamp:    getTimeStamp,
    triggerDevice:   triggerDevice,
    fetchSchedules:  fetchSchedules,
    scheduleTrigger: scheduleTrigger,
    triggerSchedule: triggerSchedule
  };
}

module.exports = function(service) {
  return new Scheduler(service);
};

