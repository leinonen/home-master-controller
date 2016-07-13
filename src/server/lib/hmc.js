'use strict';

const
  Rx = require('rx'),
  ServiceHandler = require('../lib/service.handler'),
  Events = require('../components/scheduler/events'),
  bus = require('../util/bus'),
  winston = require('winston'),
  integrations = require('./integrations');

function HomeMasterController() {

  return {

    /**
     * Get all devices.
     * @returns Promise for all devices
     */
    getDevices: () => {

      let promises = integrations.map(
        x => x.listHandler().then(x.listTransformer).catch(ServiceHandler.noServices)
      );

      return Rx.Observable.from(promises)
        .flatMap(x => x)
        .flatMap(x => x)
        .tap(x => {
          winston.info('HMC.getDevices');

        })
        .toArray()
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
          .filter(integration => integration.types.some(t => t === params.type))
          .map(integration => Rx.Observable.fromPromise(
            integration
              .controlHandler(id, params)
              .catch(ServiceHandler.noService)
          ))
        )
        .flatMap(x => x)
        .tap(device => {
          winston.info('HMC.control', id, params);
          bus.emit(Events.CONTROL_SUCCESS, {
            id: id,
            type: params.type,
            action: params.action
          });
        })
        .toPromise();
    }

  }
}

module.exports = new HomeMasterController();
