(function () {

  var module = angular.module('app');

  module.controller('DeviceListCtrl', function (DeviceManager) {
    var ctrl = this;

    ctrl.devices = function() {
      return DeviceManager.getDevices();
    };

    ctrl.showDevices = function () {
      return DeviceManager.getDevices().length > 0;
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
