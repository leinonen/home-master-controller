'use strict';

var DeviceTypes = require('./../device-types');

/**
 * Transform a Hue device to custom format.
 * @param device
 * @returns {{}}
 */
var transformHueDevice = (device) => {
  let item = {};
  item.id = device.id;
  item.name = device.name;
  item.type = DeviceTypes.HUE_DEVICE;
  item.modelid = device.modelid;
  item.manufacturername = device.manufacturername;
  item.state = device.state;
  return item;
};

exports.HueDevice = transformHueDevice;

/**
 * Transform a list of Hue devices to custom format.
 * @param devices
 * @returns {*}
 */
var transformHueDevices = (devices) => devices.map(transformHueDevice);

exports.HueDevices = transformHueDevices;

/**
 * Transform a hue group to custom format.
 * @param group
 * @returns {{}}
 */
var transformHueGroup = (group) => {
  let item = {};
  item.id = group.id;
  item.name = group.name;
  item.type = DeviceTypes.HUE_GROUP;
  item.state = group.action;
  item.devices = group.lights;
  item.motorized = false;
  return item;
};

exports.HueGroup = transformHueGroup;

/**
 * Transform a list of hue groups to custom format.
 * @param groups
 * @returns {*}
 */
var transformHueGroups = (groups) => groups.map(transformHueGroup);

exports.HueGroups = transformHueGroups;
