(function() {

  angular.module('app').directive('sensorCard', function() {
    return {
      scope: {
        sensor: '='
      },
      templateUrl: 'app/sensor/sensor-card.html',
      replace: true,
      controllerAs: 'ctrl',
      bindToController: true,
      controller: function() {
        var ctrl = this;
        ctrl.isTemperatureSensor = function() {
          return ctrl.sensor.data[0].name === 'temp';
        }
      }
    };
  });

})();
