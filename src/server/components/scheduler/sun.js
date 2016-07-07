'use strict';

let suncalc = require('suncalc');
let nconf = require('nconf');
let moment = require('moment');

let getSun = () => suncalc.getTimes(new Date(), nconf.get('location:lat'), nconf.get('location:lng'));

exports.sunsetTime  = () => moment(getSun().sunset);
exports.sunriseTime = () => moment(getSun().sunrise);
