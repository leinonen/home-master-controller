'use strict';

const
  SensorService = require('../components/sensor/sensor.service'),
  DeviceService = require('../components/device/device.service');

const sendCommand = function(socket, cmd) {
  return function(cmd) {
    socket.emit('hmc-command-response', cmd);
  };
};

const socketProtocolHandler = (socket) => {
  console.log('Got a socket connection!');

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

      default:
        sendCommand({type: 'error', data: 'Invalid command'});

    }

  });
};

exports.socketProtocolHandler = socketProtocolHandler;