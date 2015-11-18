(function() {

  angular.module('app').controller('SensorListCtrl', function(MasterApi) {
    var ctrl = this;
    ctrl.sensors = [];
    MasterApi.getSensors().then(function(sensors) {
      ctrl.sensors = sensors;
    });

  });

  angular.module('app').directive('sensorList', function() {
    return {
      scope: {},
      templateUrl: 'app/sensor/sensor-list.html',
      replace: true,
      controller: 'SensorListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
