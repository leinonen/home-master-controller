var SunCalc = require('suncalc');
var hmcConfig = require('../../hmc.conf');
var getTimeStamp = (date) => date.toString().substring(16, 24);
var getSun = () => SunCalc.getTimes(new Date(), hmcConfig.location.lat, hmcConfig.location.lng);
exports.getSunsetTime  = () => getTimeStamp(getSun().sunset);
exports.getSunriseTime = () => getTimeStamp(getSun().sunrise);
