'use strict';

var Bus = require('./bus');
var Events = require('./events');
var Master = require('./master');
var Config = require('./config');
var SunCalc = require('suncalc');

module.exports = function(service) {
  var _service = service;
  var _schedulerHandle = null;
  var _schedules = [];

  var start = () => {
    Bus.on(Events.UPDATE_SCHEDULER, () => {
      setTimeout(() => {
        fetchSchedules().then(schedules => {
          _schedules = schedules;
          console.log('Scheduler refreshed');
          _schedules.forEach(s => console.log(s.name + ' -> ' + s.time));
        });
      }, 5); // Why?
    });
    Bus.on(Events.SCHEDULE_TRIGGER, scheduleTrigger);
    Bus.emit(Events.UPDATE_SCHEDULER);

    _schedulerHandle = setInterval(() => {
      _schedules.forEach((schedule) => {
        runSchedule(new Date(), schedule);
      });
    }, 1000);
  };

  var stop = () => {
    clearInterval(_schedulerHandle);
  };

  var getSchedules   = () => _schedules;
  var fetchSchedules = () => _service.findAll(); //.then(scheduleList => scheduleList);

  var runSchedule = (now, schedule) => {
    let dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    let currentDay = dayMap[now.getDay()];
    let currentTime = getTimeStamp(now);
    let offset = getRandomInt(0, schedule.random || 0);
    let scheduleTime = timeOffset(schedule.time, offset) + ':00';

    // Handle sunrise or sunset
    if (schedule.sunrise) {
      scheduleTime = getSunriseTime();
    } else if (schedule.sunset) {
      scheduleTime = getSunsetTime();
    }

    if (scheduleTime === currentTime) {
      Bus.emit(Events.SCHEDULE_TRIGGER, {
        schedule: schedule,
        scheduleTime: scheduleTime,
        currentDay: currentDay,
        currentTime: currentTime
      });
    }
  };

  var triggerSchedule = (schedule, scheduleTime, currentDay, currentTime) => {
    console.log('Trigger Schedule -> (%s, scheduleTime: %s, random: %d)', schedule.name, scheduleTime, schedule.random);
    schedule.weekdays.forEach(wd => {
      if (wd === currentDay) {
        schedule.items.forEach(item => triggerDevice(item, schedule.action));
      }
    });
  };

  var scheduleTrigger = (message) =>
    triggerSchedule(message.schedule,
      message.scheduleTime,
      message.currentDay,
      message.currentTime);

  var triggerDevice = (item, action) => {
    console.log('scheduler.triggerDevice -> (' + item.id + ', ' + item.type + ', ' + action + ')');
    var params = {
      action: action,
      type: item.type
    };
    Master.control(item.id, params).then(response => console.log(response));
  };

  var timeOffset = (time, offsetMinutes) => {
    let d = new Date();
    d.setHours(time.substring(0, 2));
    d.setMinutes(time.substring(3, 5));
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toString().substring(16, 21);
  };

  var getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  var getTimeStamp = (date) => date.toString().substring(16, 24);
  var getSun = () => SunCalc.getTimes(new Date(), Config.location.lat, Config.location.lng);
  var getSunsetTime  = () => getTimeStamp(getSun().sunset);
  var getSunriseTime = () => getTimeStamp(getSun().sunrise);


  return {
    start: start,
    stop: stop,
    getSchedules: getSchedules,
    fetchSchedules: fetchSchedules,
    timeOffset: timeOffset,
    getTimeStamp: getTimeStamp,
    runSchedule: runSchedule,
    triggerSchedule:triggerSchedule,
    scheduleTrigger:scheduleTrigger,
    triggerDevice:triggerDevice
  };
};
