(function () {

  angular.module('app').service('Socket', function ($http) {

    var service = this;

    service.io = io();

    service.io.on('connection', function(msg) {
      console.log('connection!', msg);
    });

    service.io.on('hmc-command-response', function(response) {
      console.log('hmc-command-response', response);

      if (response.type === 'sensors') {
        var sensors = response.data;
        // notify sensor service
        console.log('got some sensors', sensors);
      }


    });

    // Sensors
    this.emit = function (msg, data) {
      console.log('emit', msg, data);
      service.io.emit(msg, data);
    };

  });

})();
