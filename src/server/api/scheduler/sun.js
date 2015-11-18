'use strict';
var SunCalc = require('suncalc');
var nconf = require('nconf');
var getTimeStamp = (date) => date.toString().substring(16, 24);
var getSun = () => SunCalc.getTimes(
  new Date(),
  nconf.get('location:lat'),
  nconf.get('location:lng')
);
exports.getSunsetTime  = () => getTimeStamp(getSun().sunset);
exports.getSunriseTime = () => getTimeStamp(getSun().sunrise);
