var fs = require('fs');
var path = require('path');
var homedir = require('homedir');
var Logger = require('./util/logger');

var conf = path.join(homedir(), '/.hmc.conf');
if (!fs.existsSync(conf)) {
  Logger.error('HMC: Configuration file missing! Create .hmc.conf in your home directory.');
  process.exit(-1);
}

var config = JSON.parse(fs.readFileSync(conf, 'utf-8'));

if (config.defaultUser === undefined) {
  Logger.error('HMC: Invalid configuration. Missing defaultUser');
  process.exit(-1);
}

Logger.info('HMC: Configuration validated successfully!');

module.exports = config;
