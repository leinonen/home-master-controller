(function () {

  var module = angular.module('device');

  module.controller('TelldusDeviceCtrl', function ($scope, $rootScope, $timeout, MasterApi) {
    var ctrl = this;
    ctrl.device = $scope.device;

    function fetchDevices() {
      //$rootScope.$emit('fetchDevices');
      $rootScope.$emit('fetchDevice', {id: ctrl.device.id, type: ctrl.device.type});
    }

    function control(params) {
      params.type = ctrl.device.type;
      MasterApi.control(ctrl.device.id, params).then(function (status) {
        $timeout(fetchDevices, 250);
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
        control({action: ctrl.device.motorized ? 'down' : 'off'});
      } else {
        control({action: ctrl.device.motorized ? 'up' : 'on'});
      }
    };


  });

  module.directive('telldusDevice', function () {
    return {
      scope: {
        device: '='
      },
      replace: true,
      templateUrl: 'app/device/telldus-device.html',
      controller: 'TelldusDeviceCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
