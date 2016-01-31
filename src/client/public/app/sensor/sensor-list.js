(function() {

  angular.module('app').controller('SensorListCtrl', function(MasterApi, ErrorHandler) {
    var ctrl = this;
    ctrl.sensors = [];
    MasterApi.getSensors().then(function(sensors) {
      ctrl.sensors = sensors;
    }).catch(ErrorHandler.handle);

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
