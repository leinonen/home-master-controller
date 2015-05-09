var TELLSTICK_TURNON = 1;
var TELLSTICK_TURNOFF = 2;
var TELLSTICK_BELL = 4;
var TELLSTICK_TOGGLE = 8;
var TELLSTICK_DIM = 16;
var TELLSTICK_LEARN = 32;
var TELLSTICK_EXECUTE = 64;
var TELLSTICK_UP = 128;
var TELLSTICK_DOWN = 256;
var TELLSTICK_STOP = 512;

function bitset(value, mask) {
  return (value & mask) !== 0;
}


function isMotorized(device) {
  return bitset(device.methods, TELLSTICK_DOWN) || bitset(device.methods, TELLSTICK_UP);
}

function isOn(device) {
  return isMotorized(device) ?
    bitset(device.state, TELLSTICK_UP) :
    bitset(device.state, TELLSTICK_TURNON);
}

function isOff(device) {
  return isMotorized(device) ?
    bitset(device.state, TELLSTICK_DOWN) :
    bitset(device.state, TELLSTICK_TURNOFF);
}

function getSupportedMethods(device) {
  var methods = [];
  if (bitset(device.methods, TELLSTICK_TURNON)) {
    methods.push('on');
  }
  if (bitset(device.methods, TELLSTICK_TURNOFF)) {
    methods.push('off');
  }
  if (bitset(device.methods, TELLSTICK_UP)) {
    methods.push('up');
  }
  if (bitset(device.methods, TELLSTICK_DOWN)) {
    methods.push('down');
  }
  if (bitset(device.methods, TELLSTICK_STOP)) {
    methods.push('stop');
  }
  return methods;
}

exports.isMotorized = isMotorized;
exports.isOn = isOn;
exports.isOff = isOff;
exports.getSupportedMethods = getSupportedMethods;
