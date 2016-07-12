'use strict';

const
  Hue = require('../lib/hue/hue'),
  ZWave = require('../lib/zwave/zwave'),
  Telldus = require('../lib/telldus/telldus'),
  DeviceTypes = require('../lib/device-types');

let integrations = [
  {
    name: 'ZWave',
    types: [DeviceTypes.ZWAVE_SWITCH_BINARY,
      DeviceTypes.ZWAVE_SWITCH_MULTILEVEL
    ],
    deviceHandler: ZWave.device,
    deviceTransformer: ZWave.transformDevice,
    listHandler: ZWave.devices,
    listTransformer: ZWave.transformDevices,
    controlHandler: ZWave.control
  },
  {
    name: 'Philips Hue',
    types: [DeviceTypes.HUE_DEVICE
    ],
    deviceHandler: Hue.light,
    deviceTransformer: Hue.transformDevice,
    listHandler: Hue.lights,
    listTransformer: Hue.transformDevices,
    controlHandler: Hue.control
  },
  {
    name: 'Telldus Live',
    types: [DeviceTypes.TELLDUS_DEVICE
    ],
    deviceHandler: Telldus.device,
    deviceTransformer: Telldus.transformDevice,
    listHandler: Telldus.devices,
    listTransformer: Telldus.transformDevices,
    controlHandler: Telldus.control
  }
];

module.exports = integrations;
