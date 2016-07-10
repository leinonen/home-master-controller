'use strict';
var ServiceHandler = require('../../lib/service.handler');
var DeviceTypes = require('../../lib/device-types');
var Telldus = require('../../lib/telldus/telldus');
var ZWave = require('../../lib/zwave/zwave');


let SENSOR = (cb, xform, id) => cb(id).then(xform)
    .catch(!!id ? ServiceHandler.noService :
                  ServiceHandler.noServices);

let ZWAVE_SENSOR    = (id) => SENSOR(ZWave.sensor, ZWave.transformSensor, id);
let ZWAVE_SENSORS   = ()   => SENSOR(ZWave.sensors, ZWave.transformSensors);
var TELLDUS_SENSOR  = (id) => SENSOR(Telldus.sensor, Telldus.transformSensor, id);
var TELLDUS_SENSORS = ()   => SENSOR(Telldus.sensors, Telldus.transformSensors);

exports.getSensors = () => {
  let promises = [TELLDUS_SENSORS(), ZWAVE_SENSORS()];
  return Promise.all(promises).then(arr =>
    arr.reduce((a, b) => a.concat(b))
  );
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
