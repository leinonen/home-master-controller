'use strict';

var SunCalc = require('suncalc');

var Bus = require('../../util/bus');
var Logger = require('../../util/logger');
var Events = require('./events');
var hmcConfig = require('../../hmc.conf');

module.exports = function(service) {
  var _service = service;
  var _schedulerTimerHandle = null;
  var _schedules = [];

  var start = () => {
    Bus.on(Events.UPDATE_SCHEDULER, updateScheduler);
    Bus.on(Events.SCHEDULE_TRIGGER, scheduleTrigger);
    Bus.emit(Events.UPDATE_SCHEDULER);

    _schedulerTimerHandle = setInterval(() => {
      _schedules.forEach((schedule) => {
        runSchedule(new Date(), schedule);
      });
    }, 1000);
    Logger.info('SCHEDULER: Started');
  };

  var stop = () => {
    clearInterval(_schedulerTimerHandle);
  };

  var updateScheduler = () => {
    setTimeout(() => {
      fetchSchedules().then(schedules => {
        _schedules = schedules;
        Logger.info('SCHEDULER: Refreshed');
        _schedules.forEach(s => Logger.info('SCHEDULER: ' + s.name + ' -> ' + s.time));
      });
    }, 5); // Why must I use setTimeout?
  };

  var getSchedules   = () => _schedules;
  var fetchSchedules = () => _service.findAll();

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
      Bus.emit(Events.SCHEDULE_TRIGGER, { schedule: schedule, scheduleTime: scheduleTime, currentDay: currentDay});
    }
  };

  var triggerSchedule = (schedule, scheduleTime, currentDay) => {
    Logger.info('SCHEDULER: Trigger Schedule -> ('+schedule.name+
      ', scheduleTime: '+scheduleTime+', random: '+schedule.random+', sunset: '+
      (schedule.sunset ? 'yes' : 'no')+', sunrise: '+(schedule.sunrise ? 'yes' : 'no')+')');

    schedule.weekdays.forEach(wd => {
      if (wd === currentDay) {
        schedule.items.forEach(item => triggerDevice(item, schedule.action));
      }
    });
  };

  var scheduleTrigger = (message) =>
    triggerSchedule(message.schedule, message.scheduleTime,  message.currentDay);

  var triggerDevice = (item, action) => {
    Logger.debug('SCHEDULER: Trigger Device -> (' + item.id + ', ' + item.type + ', ' + action + ')');
    var message = {
      id: item.id,
      action: action,
      type: item.type
    };
    Bus.emit(Events.CONTROL_DEVICE, message);
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
  var getSun = () => SunCalc.getTimes(new Date(), hmcConfig.location.lat, hmcConfig.location.lng);
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
