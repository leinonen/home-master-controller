'use strict';

const DeviceTypes = require('./../device-types');

/**
 * Transform a zwave device to custom format.
 * @param device
 * @returns {{}}
 */
const transformZWaveDevice = (device) => {
  let item = {};
  item.id = device.id;

  if (device.deviceType === 'switchBinary') {
    item.type = DeviceTypes.ZWAVE_SWITCH_BINARY;
  } else if (device.deviceType === 'switchMultilevel') {
    item.type = DeviceTypes.ZWAVE_SWITCH_MULTILEVEL;
  } else {
    item.type = device.deviceType;
  }

  item.name = device.metrics.title;
  item.state = {};
  if (device.deviceType === 'switchMultilevel') {
    item.state.level = device.metrics.level;
  } else {
    item.state.on = device.metrics.level === 'on';
  }
  item.motorized = false;
  return item;
};
exports.ZWaveDevice = transformZWaveDevice;

const transformZWaveDevices = (devices)  => devices.map(transformZWaveDevice);

exports.ZWaveDevices = transformZWaveDevices;


/**
 * Transform a zwave sensor to custom format.
 * @param device
 * @returns {{}}
 */
const transformZWaveSensor = (device) => {
  let item = {};
  item.id = device.id;

  if (device.deviceType === 'sensorBinary') {
    item.type = DeviceTypes.ZWAVE_SENSOR_BINARY;
  } else if (device.deviceType === 'sensorMultilevel') {
    item.type = DeviceTypes.ZWAVE_SENSOR_MULTILEVEL;
  } else {
    item.type = device.deviceType;
  }
  item.name = device.metrics.title;

  item.data = [{
    name: device.metrics.probeTitle || 'unkown',
    value: (parseFloat(device.metrics.level).toFixed(2)) + ' ' + (device.metrics.scaleTitle || '')
  }];

  return item;
};

exports.ZWaveSensor = transformZWaveSensor;


/**
 * Transform a list of zwave sensors to custom format.
 * @param devices
 * @returns {*}
 */
const transformZWaveSensors = (devices) => devices.map(transformZWaveSensor);

exports.ZWaveSensors = transformZWaveSensors;
