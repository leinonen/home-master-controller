'use strict';

const
  Rx = require('rx'),
  bus = require('../util/bus'),
  DeviceService = require('../components/device/device.service'),
  GroupService = require('../components/groups/groups.service'),
  Events = require('../components/scheduler/events'),
  winston = require('winston');

const validHueActions = ['bri', 'sat', 'hue', 'colorloop-on', 'colorloop-off' ];

const executeCommand = (cmd) => {

  let action = cmd.type.split('-')[1];

  switch (cmd.type) {

    case 'device-on':
    case 'device-off':
      DeviceService.controlDevice(cmd.data.id, {
        type: cmd.data.type,
        action: action
      }, 'socket');
      break;

    case 'group-on':
    case 'group-off':
      GroupService.controlGroup(cmd.data.id, {
        type: cmd.data.type,
        action: action
      });
      break;

    default:
      //sendCommand({type: 'error', data: 'Invalid command'});
      winston.info('executeCommand', 'invalid command', cmd);
  }
};

const registerSocketProtocolHandler = function(http) {

  const io = require('socket.io')(http);

  bus.on(Events.CONTROL_SUCCESS, data => {
    winston.info('event:', 'control_success');
    io.emit('hmc-message', {
      type: 'control-success',
      data: data
    });
  });

  bus.on('sensor_change', sensor => {
    io.emit('sensor-change', sensor);
  });

  io.on('connection', socket => {

    winston.info('socket:', 'client connected');

    let hmcCommandSubscription = Rx.Observable
      .fromEvent(socket, 'hmc-command')
      .subscribe(cmd => executeCommand(cmd));

    let hueCommandSubscription = Rx.Observable
      .fromEvent(socket, 'hue-command')
      .filter(cmd => validHueActions.indexOf(cmd.params.action) !== -1)
      .subscribe(cmd => DeviceService.controlDevice(cmd.id, cmd.params, 'socket'));

    socket.on('disconnect', function(){
      winston.info('socket:', 'client disconnected', 'disposing');
      hmcCommandSubscription.dispose();
      hueCommandSubscription.dispose();
    });

  });
};

exports.registerSocketProtocolHandler = registerSocketProtocolHandler;
