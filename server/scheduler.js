'use strict';
var Bus = require('./bus');

var Schedule = require('../models/schedule');
var Master = require('./master');
var Config = require('./config');

var SunCalc = require('suncalc');

var schedulerHandle;
var schedules = [];

var getSchedules = () => {
  setTimeout(() => {

    Schedule.findAll().then(scheduleList => {
      console.log('scheduler refreshed');
      schedules = scheduleList;
      schedules.forEach(sch => console.log('%s - %s', sch.name, sch.time));
    });

  }, 5);
}

// Quick n dirty scheduler :p
var scheduler = () => schedules.forEach(runSchedule);

var timeOffset = (time, offsetMinutes) => {
  let d = new Date();
  d.setHours(time.substring(0, 2));
  d.setMinutes(time.substring(3, 5));
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d.toString().substring(16, 21);
}

var getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

var getTimeStamp = (date) => date.toString().substring(16, 24);

var runSchedule = (schedule) => {
  let now = new Date();
  let dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  let currentDay = dayMap[now.getDay()];
  let currentTime = getTimeStamp(now);
  let offset = getRandomInt(0, schedule.random || 0);
  let scheduleTime = timeOffset(schedule.time, offset) + ':00';
  let times = SunCalc.getTimes(new Date(), Config.location.lat, Config.location.lng);

  // Handle sunrise or sunset
  if (schedule.sunrise) {
    scheduleTime = getTimeStamp(times.sunrise);
  } else if (schedule.sunset) {
    scheduleTime = getTimeStamp(times.sunset);
  }

  if (scheduleTime === currentTime) {
    Bus.emit('ScheduleTrigger', {
      schedule: schedule,
      scheduleTime: scheduleTime,
      currentDay: currentDay,
      currentTime: currentTime
    });
  }
}

var triggerSchedule = (schedule, scheduleTime, currentDay, currentTime) => {
  console.log('scheduler.triggerSchedule -> (' + schedule.name + ', currentTime: ' + currentTime +
    ', scheduleTime: ' + scheduleTime + ', random: ' + schedule.random + ')');

  if (schedule.sunrise) {
    console.log('scheduler - sunrise trigger - ' + scheduleTime);
  } else if (schedule.sunset) {
    console.log('scheduler - sunset trigger - ' + scheduleTime);
  }

  schedule.weekdays.forEach(wd => {
    if (wd === currentDay) {
      schedule.items.forEach(item => triggerDevice(item, schedule.action));
    }
  });
}

var scheduleTrigger = (message) =>
  triggerSchedule(message.schedule,
                  message.scheduleTime,
                  message.currentDay,
                  message.currentTime);

var triggerDevice = (item, action) => {
  console.log('scheduler.triggerDevice -> (' + item.id + ', ' + item.type + ', ' + action + ')');
  Master
    .control(item.id, {
      action: action,
      type: item.type
    })
    .then(response => console.log(response));
}

var startScheduler = () => {
  Bus.on('SchedulerUpdate', getSchedules);
  Bus.on('ScheduleTrigger', scheduleTrigger);
  Bus.emit('SchedulerUpdate');
  schedulerHandle = setInterval(scheduler, 1000);
}

var stopScheduler = () => clearInterval(schedulerHandle);

exports.startScheduler = startScheduler;
exports.stopScheduler = stopScheduler;
