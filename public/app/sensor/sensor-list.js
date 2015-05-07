(function () {

  var module = angular.module('sensor', ['hmc']);

  module.controller('SensorListCtrl', function (MasterApi) {
    var ctrl = this;
    this.sensors = [];
    MasterApi.getSensors().then(function (sensors) {
      ctrl.sensors = sensors;
    });
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
