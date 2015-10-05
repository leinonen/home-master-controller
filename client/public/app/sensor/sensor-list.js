(function () {

  angular.module('app').controller('SensorListCtrl', function (MasterApi, $interval) {
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

  angular.module('app').directive('sensorList', function () {
    return {
      scope: {},
      templateUrl: 'app/sensor/sensor-list.html',
      replace: true,
      controller: 'SensorListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
