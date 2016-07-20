'use strict';

(function () {

  angular.module('app').service('Socket', function ($rootScope) {

    var service = this;

    service.io = io();

    service.initialize = function() {

      service.io.on('hmc-message', function(response) {
        if (response.type === 'control-success') {
          var device = response.data;
          // console.log('control-success', device);
          $rootScope.$broadcast('sync-device', device);
        }
      });

      service.io.on('sensor-change', function(sensor) {
        $rootScope.$broadcast('sensor-change', sensor);
      });

    };



    service.emit = function (msg, data) {
      service.io.emit(msg, data);
    };

    var sendCommand = function(type, data) {
      service.emit('hmc-command', { type: type, data: data || null });
    };

    service.getSensors = function() {
      sendCommand('get-sensors');
    };

    service.getDevices = function() {
      sendCommand('get-devices');
    };

    service.turnOn = function(id, type) {
      sendCommand('device-on', {id: id, type: type});
    };

    service.turnOff = function(id, type) {
      sendCommand('device-off', {id: id, type: type});
    };

    service.turnOnGroup = function(id, type) {
      sendCommand('group-on', {id: id, type: type});
    };

    service.turnOffGroup = function(id, type) {
      sendCommand('group-off', {id: id, type: type});
    };

    service.hueCommand = function(cmd) {
      service.emit('hue-command', cmd);
      console.log(cmd);
    };

  });

})();
