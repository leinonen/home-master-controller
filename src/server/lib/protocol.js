'use strict';

const
  bus = require('../util/bus'),
  SensorService = require('../components/sensor/sensor.service'),
  DeviceService = require('../components/device/device.service'),
  GroupService = require('../components/groups/groups.service'),
  DeviceActions = require('../lib/device-actions'),
  Events = require('../components/scheduler/events'),
  winston = require('winston');

const registerSocketProtocolHandler = function(http) {

  const io = require('socket.io')(http);

  bus.on(Events.CONTROL_SUCCESS, data => {
    winston.info('event:', 'control_success');
    io.emit('hmc-message', {
      type: 'control-success',
      data: data
    });
  });

  io.on('connection', socket => {
    socket.on('disconnect', function(){
      winston.info('socket:', 'client disconnected');
    });

    let sendCommand = cmd => {
      socket.emit('hmc-command-response', cmd);
      winston.log('socket:', 'sendCommand', cmd.type);
    };

    winston.info('socket:', 'client connected');

    socket.on('hmc-command', function(cmd) {

      winston.info('socket received:', 'hmc-command', cmd.type);

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


        case 'group-on':
          GroupService.controlGroup(cmd.data.id, {
            type: cmd.data.type,
            action: DeviceActions.ACTION_ON
          });
          break;

        case 'group-off':
          GroupService.controlGroup(cmd.data.id, {
            type: cmd.data.type,
            action: DeviceActions.ACTION_OFF
          });
          break;

        default:
          sendCommand({type: 'error', data: 'Invalid command'});

      }

    });
  });
};

exports.registerSocketProtocolHandler = registerSocketProtocolHandler;
