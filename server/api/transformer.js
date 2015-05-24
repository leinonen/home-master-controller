var GenericTransformer = require('./generic-transformer');
var TelldusTransformer = require('./telldus-transformer');
var HueTransformer = require('./hue-transformer');
var ZWaveTransformer = require('./zwave-transformer');

// Generic groups (and other things in the future?)
exports.GenericGroup = GenericTransformer.GenericGroup;
exports.GenericGroups = GenericTransformer.GenericGroups;

// Telldus
exports.TelldusDevice = TelldusTransformer.TelldusDevice;
exports.TelldusDevices = TelldusTransformer.TelldusDevices;
exports.TelldusGroup = TelldusTransformer.TelldusGroup;
exports.TelldusGroups = TelldusTransformer.TelldusGroups;
exports.TelldusSensors = TelldusTransformer.TelldusSensors;

// Hue
exports.HueDevice = HueTransformer.HueDevice;
exports.HueDevices = HueTransformer.HueDevices;
exports.HueGroup = HueTransformer.HueGroup;
exports.HueGroups = HueTransformer.HueGroups;

// ZWave
exports.ZWaveDevice = ZWaveTransformer.ZWaveDevice;
exports.ZWaveDevices = ZWaveTransformer.ZWaveDevices;
exports.ZWaveSensor = ZWaveTransformer.ZWaveSensor;
exports.ZWaveSensors = ZWaveTransformer.ZWaveSensors;
