var Bus = require('./bus');

var Schedule = require('../models/schedule');
var Master = require('./master');
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

function runSchedule(schedule) {
  var now = new Date();
  var dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var currentDay = dayMap[now.getDay()];
  var currentTime = now.toString().substring(16, 24);
  var scheduleTime = schedule.time + ':00';
  if (scheduleTime === currentTime) {
    triggerSchedule(schedule, scheduleTime, currentDay, currentTime);
  }
}

function triggerSchedule(schedule, scheduleTime, currentDay, currentTime) {
  console.log('scheduler - triggerSchedule -> ' + schedule.name);
  console.log('scheduler - currentTime: ' + currentTime + ', scheduleTime: ' + scheduleTime);
  for (var x = 0; x < schedule.weekdays.length; x++) {
    if (schedule.weekdays[x] === currentDay) {
      schedule.items.forEach(function (item) {
        triggerDevice(item, schedule.action);
      });
    }
  }
}

function triggerDevice(item, action) {
  console.log('scheduler - triggerDevice: (' + item.id + ' ' + item.type + ') -> ' + action);
  Master.control(item.id, {
    action: action,
    type: item.type
  }).then(function (response) {
    console.log(response);
  });
}

function startScheduler() {
  Bus.on('SchedulerUpdate', getSchedules);
  Bus.emit('SchedulerUpdate');
  schedulerHandle = setInterval(scheduler, 1000);
}

function stopScheduler() {
  clearInterval(schedulerHandle);
}

exports.startScheduler = startScheduler;
exports.stopScheduler = stopScheduler;
