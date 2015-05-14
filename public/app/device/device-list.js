(function () {

  var module = angular.module('device');

  module.controller('DeviceListCtrl', function ($rootScope, $timeout, MasterApi) {
    var ctrl = this;
    ctrl.devices = [];
    ctrl.message = '';

    function fetchDevices() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
        console.log('got device list');
      }).catch(function (err) {
        ctrl.message = err.data.statusCode + ' : ' + err.data.message + ' : ' + err.data.url;
      });
    }

    fetchDevices();

    $rootScope.$on('fetchDevices', fetchDevices);

    ctrl.showDevices = function () {
      return ctrl.devices.length > 0;
    };

  });

  module.directive('deviceList', function () {
    return {
      scope: {},
      templateUrl: 'app/device/device-list.html',
      replace: true,
      controller: 'DeviceListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
