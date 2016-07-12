'use strict';

const
  Rx = require('rx'),
  Hue = require('../lib/hue/hue'),
  ZWave = require('../lib/zwave/zwave'),
  Telldus = require('../lib/telldus/telldus'),
  DeviceTypes = require('../lib/device-types'),
  ServiceHandler = require('../lib/service.handler'),
  winston = require('winston');


function HomeMasterController(customIntegrations) {
  let integrations = customIntegrations || [
    {
      name:              'ZWave',
      type:              'device',
      types: [           DeviceTypes.ZWAVE_SWITCH_BINARY,
                         DeviceTypes.ZWAVE_SWITCH_MULTILEVEL
      ],
      deviceHandler:     ZWave.device,
      deviceTransformer: ZWave.transformDevice,
      listHandler:       ZWave.devices,
      listTransformer:   ZWave.transformDevices,
      controlHandler:    ZWave.control
    },
    {
      name:              'Philips Hue',
      type:              'device',
      types: [           DeviceTypes.HUE_DEVICE
      ],
      deviceHandler:     Hue.light,
      deviceTransformer: Hue.transformDevice,
      listHandler:       Hue.lights,
      listTransformer:   Hue.transformDevices,
      controlHandler:    Hue.control
    },
    {
      name:              'Telldus Live',
      type:              'device',
      types: [           DeviceTypes.TELLDUS_DEVICE
      ],
      deviceHandler:     Telldus.device,
      deviceTransformer: Telldus.transformDevice,
      listHandler:       Telldus.devices,
      listTransformer:   Telldus.transformDevices,
      controlHandler:    Telldus.control
    }
  ];

  return {

    /**
     * Get all devices.
     * @returns Promise for all devices
     */
    getDevices: () => {
      return Rx.Observable.from(
        integrations
        .filter(integration => integration.type === 'device')
        .map(integration => Rx.Observable.fromPromise(
          integration
            .listHandler()
            .then(integration.listTransformer)
            .catch(ServiceHandler.noServices)
        )))
        .flatMap(x => x)
        .tap(devices => winston.info('HMC.getDevices', devices.length))
        .toPromise();
    },

    /**
     * Get a specific device
     * @param id the device identifier
     * @param type the device type
     * @returns Promise for device data
     */
    getDevice: (id, type) => {
      return Rx.Observable.from(
        integrations
          .filter(integration => integration.type === 'device')
          .filter(integration => integration.types.some(t => t === type))
          .map(integration => Rx.Observable.fromPromise(
          integration
            .deviceHandler(id)
            .then(integration.deviceTransformer)
            .catch(ServiceHandler.noService)
        ))
        )
        .flatMap(x => x)
        .tap(device => winston.info('HMC.getDevice', device.id, device.type))
        .toPromise();
    },

    /**
     * Control a device, turn on or off etc..
     * @param id the device id
     * @param params object describing the device and action to perform
     * @returns Promise for the result of the action
     */
    control: (id, params) => {
      return Rx.Observable.from(
        integrations
          .filter(integration => integration.type === 'device')
          .filter(integration => integration.types.some(t => t === params.type))
          .map(integration => Rx.Observable.fromPromise(
            integration
              .controlHandler(id, params)
              .catch(ServiceHandler.noService)
          ))
        )
        .flatMap(x => x)
        .tap(device => winston.info('HMC.control', id, params))
        .toPromise();
    }

  }
}

module.exports = new HomeMasterController();
