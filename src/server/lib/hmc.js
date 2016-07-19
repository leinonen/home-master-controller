'use strict';

const
  Rx = require('rx'),
  bus = require('../util/bus'),
  Events = require('../components/scheduler/events'),
  winston = require('winston'),
  ServiceHandler = require('../lib/service.handler'),
  Integrations = require('./integrations');

function HomeMasterController() {

  return {

    /**
     * Get all devices.
     * @returns Promise for all devices
     */
    getDevices: () => {

      let promises = Integrations.map(
        x => x.listHandler().then(x.listTransformer).catch(ServiceHandler.noServices)
      );

      return Rx.Observable.from(promises)
        .flatMap(x => x)
        .flatMap(x => x)
        .tap(device => {
          winston.info('HMC.getDevices', device.type, device.id, device.name);
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
        Integrations
          .filter(integration => integration.types.some(t => t === type))
          .map(integration => {
            console.log('getDevice', integration.name, id, type);
            return Rx.Observable.fromPromise(
            integration
              .deviceHandler(id)
              .then(integration.deviceTransformer)
              .catch(ServiceHandler.noService)
          );
          })
        )
        .flatMap(x => x)
        // .tap(device => winston.info('HMC.getDevice', device.id, device.type))
        .toPromise();
    },

    /**
     * Control a device, turn on or off etc..
     * @param id the device id
     * @param params object describing the device and action to perform
     * @param initiator string representing the initiator: socket, scheduler etc..
     * @returns Promise for the result of the action
     */
    control: (id, params, initiator) => {
      return Rx.Observable.from(
        Integrations
          .filter(integration => integration.types.some(t => t === params.type))
          .map(integration => Rx.Observable.fromPromise(
            integration
              .controlHandler(id, params)
              .catch(ServiceHandler.noService)
          ))
        )
        .flatMap(x => x)
        .tap(() => {
          winston.info('HMC.control', id, params, 'initiator: ', initiator);
          bus.emit(Events.CONTROL_SUCCESS, {
            id: id,
            type: params.type,
            action: params.action
          });
        })
        .toPromise();
    }

  };
}

module.exports = new HomeMasterController();
