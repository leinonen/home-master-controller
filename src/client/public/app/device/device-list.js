(function () {

  var module = angular.module('app');

  module.controller('DeviceListCtrl', function ($rootScope, Devices) {
    var ctrl = this;

    $rootScope.$emit('fetchDevices');

    ctrl.devices = function() {
      return Devices.getDevices();
    };

    ctrl.showDevices = function () {
      return Devices.getDevices().length > 0;
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
