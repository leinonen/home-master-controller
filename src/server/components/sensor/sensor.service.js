'use strict';
var DeviceTypes = require('../../lib/device-types');
var Telldus = require('../../lib/telldus/telldus');
var ZWave = require('../../lib/zwave/zwave');
var ServiceHandler = require('../../lib/service.handler');

let SENSOR = (id, cb, xform) => cb(id).then(xform).catch(ServiceHandler.noService);
let SENSORS = (cb, xform) => cb().then(xform).catch(ServiceHandler.noServices);

let ZWAVE_SENSOR    = (id) => SENSOR(id, ZWave.sensor, ZWave.transformSensor);
let ZWAVE_SENSORS   = ()   => SENSORS(ZWave.sensors, ZWave.transformSensors);
var TELLDUS_SENSOR  = (id) => SENSOR(id, Telldus.sensor, Telldus.transformSensor);
var TELLDUS_SENSORS = ()   => SENSORS(Telldus.sensors, Telldus.transformSensors);

exports.getSensors = () => {
  let promises = [TELLDUS_SENSORS(), ZWAVE_SENSORS()];
  return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
};

exports.getSensor = (id, type) => {
  switch (type) {
    case DeviceTypes.TELLDUS_SENSOR:
      return TELLDUS_SENSOR(id);

    case DeviceTypes.ZWAVE_SENSOR_BINARY:
    case DeviceTypes.ZWAVE_SENSOR_MULTILEVEL:
      return ZWAVE_SENSOR(id);

    default :
      return Promise.reject('Unsupported sensor type: ' + type);
  }
};
