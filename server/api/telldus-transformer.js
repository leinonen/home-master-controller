var DeviceTypes = require('./device-types');
var telldusHelper = require('./telldus-helper');

/**
 * Transform a telldus sensor to custom format.
 * @param sensors
 * @returns {*}
 */
var transformTelldusSensors = (sensors) => sensors.map(sensor => {
  sensor.type = DeviceTypes.TELLDUS_SENSOR;
  return sensor;
});

exports.TelldusSensors = transformTelldusSensors;

/**
 * Transform a telldus device to custom format.
 * @param device
 * @returns {{}}
 */
function transformTelldusDevice(device) {
  var item = {};
  item.id = device.id;
  item.name = device.name;
  item.type = DeviceTypes.TELLDUS_DEVICE;
  item.motorized = telldusHelper.isMotorized(device);
  item.methods = telldusHelper.getSupportedMethods(device);
  item.state = {};
  item.state.on = telldusHelper.isOn(device);
  return item;
}
exports.TelldusDevice = transformTelldusDevice;

/**
 * Transform a list of telldus devices to custom format.
 * @param devices
 * @returns {*}
 */
var transformTelldusDevices = (devices) => devices.map(transformTelldusDevice);

exports.TelldusDevices = transformTelldusDevices;



/**
 * Transform a telldus group to custom format.
 * @param group
 * @returns {{}}
 */
function transformTelldusGroup(group) {
  var item = {};
  item.id = group.id;
  item.name = group.name;
  item.type = DeviceTypes.TELLDUS_GROUP;
  item.methods = telldusHelper.getSupportedMethods(group);
  item.state = {};
  item.state.on = telldusHelper.isOn(group);
  item.devices = group.devices.split(',');
  item.motorized = telldusHelper.isMotorized(group);
  return item;
}
exports.TelldusGroup = transformTelldusGroup;

/**
 * Transform a telldus group to custom format.
 * @param groups
 * @returns {*}
 */
var transformTelldusGroups = (groups) => groups.map(transformTelldusGroup);

exports.TelldusGroups = transformTelldusGroups;
