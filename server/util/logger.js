// Very basic logger :)

var log = (level, message) => {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
  var dateStr = localISOTime.substring(0,10);
  var timeStr = localISOTime.substring(11,19);
  var nowIso = dateStr + ' ' + timeStr;
  console.log('[%s][%s] ' + message, level, nowIso);
};

exports.info = (message) => log('INFO', message);
exports.error = (message) => log('ERROR', message);
exports.debug = (message) => log('DEBUG', message);
