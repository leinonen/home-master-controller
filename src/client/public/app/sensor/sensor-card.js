(function() {

  angular.module('app')
    .component('sensorCard', {
      templateUrl: 'app/sensor/sensor-card.html',
      bindings: {
        sensor: '='
      },
      controller: function() {
        var ctrl = this;
        ctrl.isTemperatureSensor = function() {
          return ctrl.sensor.data[0].name === 'temp';
        }
      }
    });

})();
