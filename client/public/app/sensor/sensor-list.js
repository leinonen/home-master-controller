(function () {

  var module = angular.module('sensor', ['master']);

  module.controller('SensorListCtrl', function (MasterApi, $interval) {
    var ctrl = this;
    this.sensors = [];
    MasterApi.getSensors().then(function (sensors) {
      ctrl.sensors = sensors;
    });

    $interval(function() {
      MasterApi.getSensors().then(function (sensors) {
        ctrl.sensors = sensors;
      });
    }, 10000);
  });

  module.directive('sensorList', function () {
    return {
      scope: {},
      templateUrl: 'app/sensor/sensor-list.html',
      replace: true,
      controller: 'SensorListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
