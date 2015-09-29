// Very basic logger :)

var log = (level, message) => {
  var now = new Date();
  var dateStr = now.toISOString().substring(0,10);
  var timeStr = now.toISOString().substring(11,19);
  var nowIso = dateStr + ' ' + timeStr;
  console.log('[%s][%s] ' + message, level, nowIso);
};

exports.info = (message) => log('INFO', message);
exports.error = (message) => log('ERROR', message);
exports.debug = (message) => log('DEBUG', message);
