(function() {

  angular.module('app')
    .component('sensorList', {
      templateUrl: 'app/sensor/sensor-list.html',
      bindings: {},
      controller: function(MasterApi, ErrorHandler) {
        var ctrl = this;
        ctrl.sensors = [];
        MasterApi.getSensors().then(function(sensors) {
          ctrl.sensors = sensors;
        }).catch(ErrorHandler.handle);

      }
    });

})();
