(function () {

  angular.module('app').service('Socket', function ($http, Sensor, Devices) {

    var service = this;

    service.io = io();

    service.io.on('connection', function(msg) {
      console.log('connection!', msg);
    });

    service.io.on('hmc-command-response', function(response) {
      switch (response.type) {
        case 'sensors':
          Sensor.update(response.data);
          break;
        case 'devices':
          console.log('update device data',  response.data);
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
    }

  });

})();
