'use strict';

const
  bus = require('../util/bus'),
  SensorService = require('../components/sensor/sensor.service'),
  DeviceService = require('../components/device/device.service'),
  DeviceActions = require('../lib/device-actions'),
  Events = require('../components/scheduler/events');

const socketProtocolHandler = (socket) => {
  console.log('Got a socket connection!');

  bus.on(Events.CONTROL_SUCCESS, data => {
    socket.emit('hmc-message', {
      type: 'control-success',
      data: data
    });
  });

  let sendCommand = cmd => socket.emit('hmc-command-response', cmd);

  socket.on('hmc-command', function(cmd) {

    switch (cmd.type) {
      case 'get-sensors':
        SensorService.getSensors().then(
          sensors => sendCommand({ type: 'sensors', data: sensors })
        );
        break;

      case 'get-devices':
        DeviceService.getDevices().then(
          devices => sendCommand({type: 'devices', data: devices})
        );
        break;

      case 'device-on':
        DeviceService.controlDevice(cmd.data.id, {
          type: cmd.data.type,
          action: DeviceActions.ACTION_ON
        });
        break;

      case 'device-off':
        DeviceService.controlDevice(cmd.data.id, {
          type: cmd.data.type,
          action: DeviceActions.ACTION_OFF
        });
        break;

      default:
        sendCommand({type: 'error', data: 'Invalid command'});

    }

  });
};

exports.socketProtocolHandler = socketProtocolHandler;