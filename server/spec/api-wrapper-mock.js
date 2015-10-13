var Promise     = require('../util/promise');
var DeviceTypes = require('./../api/hmc/device-types');
var ApiWrapper  = require('./../api/hmc/api-wrapper');
var mockZWaveSensors   = require('./testdata/zwave-sensors.json');
var mockZWaveDevices   = require('./testdata/zwave-devices.json');
var mockTelldusSensors = require('./testdata/telldus-sensors.json');
var mockTelldusGroups  = require('./testdata/telldus-groups.json');
var mockTelldusDevices = require('./testdata/telldus-devices.json');
var mockHueGroups      = require('./testdata/hue-groups.json');
var mockHueLights      = require('./testdata/hue-lights.json');
var mockGenericGroups  = require('./testdata/generic-groups.json');
var mockGenericGroupDevices  = require('./testdata/generic-group-devices.json');

var mockTelldusAPI = {
  sensor:  () => Promise.resolve(mockTelldusSensors[0]),
  sensors: () => Promise.resolve(mockTelldusSensors),
  groups:  () => Promise.resolve(mockTelldusGroups),
  devices: () => Promise.resolve(mockTelldusDevices),
  device: (id) => Promise.resolve(mockTelldusDevices[0])
};

var mockHueAPI = {
  groups:  () => Promise.resolve(mockHueGroups),
  lights:  () => Promise.resolve(mockHueLights),
  light:  (id) => Promise.resolve(mockHueLights[0])
};

var mockZWaveAPI = {
  sensor:  () => Promise.resolve(mockZWaveSensors[0]),
  sensors: () => Promise.resolve(mockZWaveSensors),
  devices: () => Promise.resolve(mockZWaveDevices),
  device: (id) => Promise.resolve(mockZWaveDevices[0]),
  setOn:  (id) => Promise.resolve({ status: '200 OK' }),
  setOff: (id) => Promise.resolve({ status: '200 OK' })
};

var generic = {
  groups: () => Promise.resolve(mockGenericGroups),
  groupDevices: () => Promise.resolve(mockGenericGroupDevices)
};

// Create MockWrapper :D
module.exports = new ApiWrapper(mockTelldusAPI, mockHueAPI, mockZWaveAPI, generic);
