(function () {

  var module = angular.module('device');

  module.controller('HueDeviceCtrl', function ($scope, $rootScope, $timeout, MasterApi) {
    var ctrl = this;
    ctrl.device = $scope.device;

    function fetchDevices() {
      $rootScope.$emit('fetchDevices');
    }

    function control(id, params) {
      MasterApi.control(id, params).then(function (status) {
        $timeout(fetchDevices, 100);
      }).catch(console.error);
    }

    ctrl.getState = function () {
      if (ctrl.device.motorized) {
        return ctrl.device.state.on ? 'Up' : 'Down';
      } else {
        return ctrl.device.state.on ? 'On' : 'Off';
      }
    };

    ctrl.buttonText = function () {
      if (ctrl.device.motorized) {
        return ctrl.device.state.on ? 'Bring Down' : 'Bring Up';
      } else {
        return ctrl.device.state.on ? 'Turn Off' : 'Turn On';
      }
    };

    ctrl.toggleDevice = function () {
      if (ctrl.device.state.on) {
        control(ctrl.device.id, {type: ctrl.device.type, action: ctrl.device.motorized ? 'down' : 'off'});
      } else {
        control(ctrl.device.id, {type: ctrl.device.type, action: ctrl.device.motorized ? 'up' : 'on'});
      }
    };

    ctrl.setBrightness = function () {
      control(ctrl.device.id, {type: ctrl.device.type, action: 'bri', value: ctrl.device.state.bri});
    };

    ctrl.setSaturation = function () {
      control(ctrl.device.id, {type: ctrl.device.type, action: 'sat', value: ctrl.device.state.sat});
    };

    ctrl.setHue = function (device) {
      control(ctrl.device.id, {type: ctrl.device.type, action: 'hue', value: ctrl.device.state.hue});
    };

  });

  module.directive('hueDevice', function () {
    return {
      scope: {
        device: '='
      },
      replace: true,
      templateUrl: 'app/device/hue-device.html',
      controller: 'HueDeviceCtrl',
      controllerAs: 'ctrl'
    };
  });

})();