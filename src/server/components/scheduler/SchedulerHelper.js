'use strict';
const moment = require('moment');
const Sun = require('./sun');

const getScheduleTime = (schedule) => {
  let time = schedule.time.split(':');
  let rnd = schedule.random || 0;
  let offset = rnd - rnd / 2;
  let offsetMinutes = Math.floor(Math.random() * offset);
  return moment()
    .hours(parseInt(time[0]))
    .minutes(parseInt(time[1]))
    .seconds(0)
    .millisecond(0)
    .add(offsetMinutes || 0, 'minutes')
};

exports.getScheduleTime = getScheduleTime;

const isScheduleTime = (currentTime, schedule) => {
  if (schedule.sunrise) {
    return currentTime.diff(Sun.sunriseTime(), 'seconds') === 0;
  } else if (schedule.sunset) {
    return currentTime.diff(Sun.sunsetTime(), 'seconds') === 0;
  } else {
    return currentTime.diff(getScheduleTime(schedule), 'seconds') === 0;
  }
};

exports.isScheduleTime = isScheduleTime;
