var fs = require('fs');
var path = require('path');
var homedir = require('homedir');

var conf = path.join(homedir(), '/.hmc.conf');
if (!fs.existsSync(conf)) {
  Logger.error('Configuration file missing! Create .hmc.conf in your home directory. See .hmc.conf.example');
  process.exit(-1);
}

var config = JSON.parse(fs.readFileSync(conf, 'utf-8'));

module.exports = config;
