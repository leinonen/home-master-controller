var Bus = require('./bus');

var Schedule = require('../models/schedule');
var Master = require('./master');
var Config = require('./config');

var SunCalc = require('suncalc');

var schedulerHandle;
var schedules = [];

function getSchedules() {
  setTimeout(function () {

    Schedule.findAll().then(function (scheduleList) {
      console.log('scheduler refreshed');
      schedules = scheduleList;
      schedules.forEach(function (sch) {
        console.log('%s - %s', sch.name, sch.time);
      });
    });

  }, 5);
}

// Quick n dirty scheduler :p
function scheduler() {
  schedules.forEach(runSchedule);
}

function timeOffset(time, offsetMinutes) {
  var d = new Date();
  d.setHours(time.substring(0, 2));
  d.setMinutes(time.substring(3, 5));
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d.toString().substring(16, 21);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getTimeStamp(date) {
  return date.toString().substring(16, 24);
}

function runSchedule(schedule) {
  var now = new Date();
  var dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var currentDay = dayMap[now.getDay()];
  var currentTime = getTimeStamp(now);
  var offset = getRandomInt(0, schedule.random || 0);
  var scheduleTime = timeOffset(schedule.time, offset) + ':00';
  var times = SunCalc.getTimes(new Date(), Config.location.lat, Config.location.lng);

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

function triggerSchedule(schedule, scheduleTime, currentDay, currentTime) {
  console.log('scheduler.triggerSchedule -> (' + schedule.name + ', currentTime: ' + currentTime +
    ', scheduleTime: ' + scheduleTime + ', random: ' + schedule.random + ')');

  if (schedule.sunrise) {
    console.log('scheduler - sunrise trigger - ' + scheduleTime);
  } else if (schedule.sunset) {
    console.log('scheduler - sunset trigger - ' + scheduleTime);
  }

  for (var x = 0; x < schedule.weekdays.length; x++) {
    if (schedule.weekdays[x] === currentDay) {
      schedule.items.forEach(function (item) {
        triggerDevice(item, schedule.action);
      });
    }
  }
}

function scheduleTrigger(message) {
  triggerSchedule(message.schedule, message.scheduleTime, message.currentDay, message.currentTime);
}

function triggerDevice(item, action) {
  console.log('scheduler.triggerDevice -> (' + item.id + ', ' + item.type + ', ' + action + ')');
  Master.control(item.id, {
    action: action,
    type: item.type
  }).then(function (response) {
    console.log(response);
  });
}

function startScheduler() {
  Bus.on('SchedulerUpdate', getSchedules);
  Bus.on('ScheduleTrigger', scheduleTrigger);
  Bus.emit('SchedulerUpdate');
  schedulerHandle = setInterval(scheduler, 1000);
}

function stopScheduler() {
  clearInterval(schedulerHandle);
}

exports.startScheduler = startScheduler;
exports.stopScheduler = stopScheduler;
