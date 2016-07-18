'use strict';

(function () {

  angular.module('app').service('Socket', function ($http, $rootScope, Sensor, Devices) {

    var service = this;

    service.io = io();

    service.io.on('hmc-message', function(response) {
      var device = response.data;
      if (response.type === 'control-success') {

        // console.log('control-success', device);
        $rootScope.$broadcast('sync-device', device);

      }
    });

    service.io.on('hmc-command-response', function(response) {
      switch (response.type) {
        case 'sensors':
          Sensor.update(response.data);
          break;
        case 'devices':
          console.log('Devices updated', response.data);
          Devices.update(response.data);
          break;

        default:
      }
    });

    service.emit = function (msg, data) {
      service.io.emit(msg, data);
    };

    service.getSensors = function() {
      service.emit('hmc-command', { type: 'get-sensors', data: null });
    };

    service.getDevices = function() {
      service.emit('hmc-command', { type: 'get-devices', data: null });
    };

    service.turnOn = function(id, type) {
      service.emit('hmc-command', { type: 'device-on', data: {id: id, type: type} });
    };

    service.turnOff = function(id, type) {
      service.emit('hmc-command', { type: 'device-off', data: {id: id, type: type} });
    };


    service.turnOnGroup = function(id, type) {
      service.emit('hmc-command', { type: 'group-on', data: {id: id, type: type} });
    };

    service.turnOffGroup = function(id, type) {
      service.emit('hmc-command', { type: 'group-off', data: {id: id, type: type} });
    };

    service.hueCommand = function(cmd) {
      service.emit('hue-command', cmd);
      console.log(cmd);
    };

  });

})();
