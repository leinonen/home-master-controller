'use strict';

let suncalc = require('suncalc');
let nconf = require('nconf');

let timeStamp = (date) => date.toString().substring(16, 24);

let getSun = () => suncalc.getTimes(
  new Date(),
  nconf.get('location:lat'),
  nconf.get('location:lng')
);

exports.sunsetTime  = () => timeStamp(getSun().sunset);
exports.sunriseTime = () => timeStamp(getSun().sunrise);
