'use strict';

(function() {

  angular.module('app')
    .component('sensorList', {
      templateUrl: 'app/sensor/sensor-list.html',
      bindings: {},
      controller: function(MasterApi, ErrorHandler, Sensor) {
        var ctrl = this;
        ctrl.getSensors = Sensor.getSensors;
      }
    });

})();
