'use strict';

var Methods = require('./telldus-methods');

var bitset = (value, mask) => (value & mask) !== 0;

function isMotorized(device) {
  return bitset(device.methods, Methods.TELLSTICK_DOWN) ||
         bitset(device.methods, Methods.TELLSTICK_UP);
}

function isOn(device) {
  return isMotorized(device) ?
    bitset(device.state, Methods.TELLSTICK_UP) :
    bitset(device.state, Methods.TELLSTICK_TURNON);
}

function isOff(device) {
  return isMotorized(device) ?
    bitset(device.state, Methods.TELLSTICK_DOWN) :
    bitset(device.state, Methods.TELLSTICK_TURNOFF);
}

function getSupportedMethods(device) {
  var methods = [];
  if (bitset(device.methods, Methods.TELLSTICK_TURNON)) {
    methods.push('on');
  }
  if (bitset(device.methods, Methods.TELLSTICK_TURNOFF)) {
    methods.push('off');
  }
  if (bitset(device.methods, Methods.TELLSTICK_UP)) {
    methods.push('up');
  }
  if (bitset(device.methods, Methods.TELLSTICK_DOWN)) {
    methods.push('down');
  }
  if (bitset(device.methods, Methods.TELLSTICK_STOP)) {
    methods.push('stop');
  }
  return methods;
}

exports.isMotorized = isMotorized;
exports.isOn = isOn;
exports.isOff = isOff;
exports.getSupportedMethods = getSupportedMethods;
