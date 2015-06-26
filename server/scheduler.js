var events = require('events');
var eventEmitter = new events.EventEmitter();

var Schedule = require('../models/schedule');
var Master = require('./master');
var schedulerHandle;
//ar schedules = [];

function getSchedules() {
  return Schedule.findAll();
}

// Quick n dirty scheduler :p
function scheduler() {
  getSchedules().then(function (schedules) {
    schedules.forEach(runSchedule);
  });
}

function runSchedule(schedule) {
  var now = new Date();
  var dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var currentDay = dayMap[now.getDay()];
  var currentTime = now.toString().substring(16, 24);
  var scheduleTime = schedule.time + ':00';
  if (scheduleTime === currentTime) {
    console.log('scheduler - trigger schedule -> ' + schedule.name);
    console.log('scheduler - currentTime: ' + currentTime + ', scheduleTime: ' + scheduleTime);
    for (var x = 0; x < schedule.weekdays.length; x++) {
      if (schedule.weekdays[x] === currentDay) {
        schedule.items.forEach(function (item) {
          triggerDevice(item, schedule.action);
        });
      }
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
  //eventEmitter.on('SchedulerUpdate', getSchedules);
  //eventEmitter.emit('SchedulerUpdate');
  schedulerHandle = setInterval(scheduler, 1000);
}

function stopScheduler() {
  clearInterval(schedulerHandle);
}

exports.startScheduler = startScheduler;
exports.stopScheduler = stopScheduler;
