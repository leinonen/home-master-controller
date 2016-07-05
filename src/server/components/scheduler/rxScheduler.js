'use strict';

const
  Rx = require('rx'),
  bus = require('../../util/bus'),
  SchedulerModel = require('./schedule.model'),
  SchedulerEvents  = require('./events'),
  Sun = require('./sun');
//  mongoose = require('mongoose-q')(),
//  nconf = require('nconf');

//nconf.argv().env().file({ file: 'config.json' });

//console.log('rx Connecting to database: %s', nconf.get('MONGO_URL'));
//mongoose.connect(nconf.get('MONGO_URL'), {server: {socketOptions: { keepAlive: 1 }}});

const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function Scheduler() {
  return {
    start: start
  }
}

module.exports = function() {
  return new Scheduler();
};



let shceduleList = [];

const timeOffsetMinutes = (time, offsetMinutes) => {
  let d = new Date();
  d.setHours(time.substring(0, 2));
  d.setMinutes(time.substring(3, 5));
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d.toString().substring(16, 21);
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getTimeStamp = (date) => date.toString().substring(16, 24);

const runSchedule = (now, schedule) => {
  let currentDay = dayMap[now.getDay()];
  let currentTime = getTimeStamp(now);
  let offsetMinutes = getRandomInt(0, schedule.random || 0);
  let scheduleTime = timeOffsetMinutes(schedule.time, offsetMinutes) + ':00';

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

let triggerDevice = (item, action) => {
  Bus.emit(Events.CONTROL_DEVICE, {
    id: item.id,
    action: action,
    type: item.type
  });
  console.log('SCHEDULER: Trigger Device -> (%s, %s, %s)', item.id, item.type, action);
};

const runSchedules = () => {
  shceduleList.forEach(schedule => runSchedule(new Date(), schedule));
};

const triggerSchedule = (msg) => {
  console.log('trigger schedule');
  msg.schedule.weekdays
    .filter(wd => wd === msg.currentDay)
    .forEach(wd => schedule.items.forEach(item => triggerDevice(item, schedule.action)));
};

const updateSchedules = (schedules) => {
  shceduleList = schedules;
  console.log('scheduler updated');
};

const start = () => {
  Rx.Observable
    .interval(1000)
    .subscribe(tick => runSchedules());

  Rx.Observable
    .fromEvent(bus, SchedulerEvents.SCHEDULE_TRIGGER)
    .subscribe(schedule => triggerSchedule(schedule));

  Rx.Observable
    .fromEvent(bus, SchedulerEvents.UPDATE_SCHEDULER)
    .flatMap(x => Rx.Observable.fromPromise(SchedulerModel.findAll()))
    .subscribe(schedules => updateSchedules(schedules));

  console.log('updating scheduler in 3 sec..');
  setTimeout(() => bus.emit(SchedulerEvents.UPDATE_SCHEDULER), 3000);
};
