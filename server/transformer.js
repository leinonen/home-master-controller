var DeviceTypes = {
  TELLDUS_DEVICE : 'telldus-device',
 TELLDUS_GROUP : 'telldus-group',
 TELLDUS_SENSOR : 'telldus-sensor',
 HUE_DEVICE : 'hue-device',
 HUE_GROUP : 'hue-group',
 GENERIC_GROUP : 'generic-group',
 ZWAVE_SWITCH : 'zwave-switch',
 ZWAVE_SENSOR : 'zwave-sensor'
};
exports.DeviceTypes = DeviceTypes;


var telldusHelper = require('./api/telldus-helper');

/**
 * Transform a telldus sensor to custom format.
 * @param sensors
 * @returns {*}
 */
function transformTelldusSensors(sensors) {
  return sensors.map(function (sensor) {
    sensor.type = DeviceTypes.TELLDUS_SENSOR;
    return sensor;
  });
}
exports.transformTelldusSensors = transformTelldusSensors;

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
exports.transformTelldusDevice = transformTelldusDevice;

/**
 * Transform a list of telldus devices to custom format.
 * @param devices
 * @returns {*}
 */
function transformTelldusDevices(devices) {
  return devices.map(transformTelldusDevice);
}
exports.transformTelldusDevices = transformTelldusDevices;



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
exports.transformTelldusGroup = transformTelldusGroup;

/**
 * Transform a telldus group to custom format.
 * @param groups
 * @returns {*}
 */
function transformTelldusGroups(groups) {
  return groups.map(transformTelldusGroup);
}
exports.transformTelldusGroups = transformTelldusGroups;

/**
 * Transform a Hue device to custom format.
 * @param device
 * @returns {{}}
 */
function transformHueDevice(device) {
  var item = {};
  item.id = device.id;
  item.name = device.name;
  item.type = DeviceTypes.HUE_DEVICE;
  item.modelid = device.modelid;
  item.manufacturername = device.manufacturername;
  //item.state = device.state;
  item.state = {
    on: telldusHelper.isOn(device)
  };
  return item;
}
exports.transformHueDevice = transformHueDevice;

/**
 * Transform a list of Hue devices to custom format.
 * @param devices
 * @returns {*}
 */
function transformHueDevices(devices) {
  return devices.map(transformHueDevice);
}
exports.transformHueDevices = transformHueDevices;

/**
 * Transform a hue group to custom format.
 * @param group
 * @returns {{}}
 */
function transformHueGroup(group) {
  var item = {};
  item.id = group.id;
  item.name = group.name;
  item.type = DeviceTypes.HUE_GROUP;
  item.state = group.action;
  item.devices = group.lights;
  item.motorized = false;
  return item;
}
exports.transformHueGroup = transformHueGroup;

/**
 * Transform a list of hue groups to custom format.
 * @param groups
 * @returns {*}
 */
function transformHueGroups(groups) {
  return groups.map(transformHueGroup);
}
exports.transformHueGroups = transformHueGroups;

/**
 * Transform a generic group (as in mongo model) to custom format.
 * @param group
 * @returns {{}}
 */
function transformGenericGroup(group) {
  var item = {};
  item.name = group.name;
  item.id = group._id;
  item.items = [];
  item.items = group.items.map(function (a) {
    return a;
  });
  item.type = DeviceTypes.GENERIC_GROUP;
  item.state = {
    on: false
  };
  item.motorized = false;
  return item;
}
exports.transformGenericGroup = transformGenericGroup;

/**
 * Transform a list of generic groups to custom format.
 * @param groups
 * @returns {*}
 */
function transformGenericGroups(groups) {
  return groups.map(transformGenericGroup);
}

exports.transformGenericGroups = transformGenericGroups;


/**
 * Transform a zwave device to custom format.
 * @param device
 * @returns {{}}
 */
function transformZWaveDevice(device) {
  var item = {};
  item.id = device.id;

  if (device.deviceType === 'switchBinary') {
    item.type = DeviceTypes.ZWAVE_SWITCH;
  } else {
    item.type = device.deviceType;
  }

  item.name = device.metrics.title;
  item.state = {};
  item.state.on = device.metrics.level === 'on';
  return item;
}
exports.transformZWaveDevice = transformZWaveDevice;

function transformZWaveDevices(devices) {
  return devices.map(transformZWaveDevice);
}
exports.transformZWaveDevices = transformZWaveDevices;


/**
 * Transform a zwave sensor to custom format.
 * @param device
 * @returns {{}}
 */
function transformZWaveSensor(device) {
  var item = {};
  item.id = device.id;

  if (device.deviceType === 'sensorMultilevel') {
    item.type = DeviceTypes.ZWAVE_SENSOR;
  } else {
    item.type = device.deviceType;
  }
  item.name = device.metrics.title;

  item.data = [{
    name: device.metrics.probeTitle,
    value: device.metrics.level + device.metrics.scaleTitle
  }];

  return item;
}
exports.transformZWaveSensor = transformZWaveSensor;


/**
 * Transform a list of zwave sensors to custom format.
 * @param devices
 * @returns {*}
 */
function transformZWaveSensors(devices) {
  return devices.map(transformZWaveSensor);
}
exports.transformZWaveSensors = transformZWaveSensors;
