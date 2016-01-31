(function () {

  angular.module('app').directive('deviceCard', function () {
    return {
      scope: {
        device: '='
      },
      templateUrl: 'app/device/device-card.html',
      replace: true,
      controllerAs: 'ctrl',
      bindToController: true,

      controller: function (DeviceManager) {
        var ctrl = this;

        ctrl.canToggleDevice = function() {
          return ctrl.device.state.on !== undefined;
        };

        ctrl.isHueDevice = function() {
          return ctrl.device.type === 'hue-device';
        };

        ctrl.toggleShowControls = function() {
          DeviceManager.toggleShowControls(ctrl.device);
        };

        ctrl.showControls = function() {
          return DeviceManager.showControls(ctrl.device);
        };

        ctrl.deviceDisabled = function() {
          return ctrl.device.state.on === false;
        };

        ctrl.showDeviceLevel = function() {
          return ctrl.device.state.level !== undefined;
        };

        ctrl.setLevel = function () {
          DeviceManager.setLevel(ctrl.device);
        };

        ctrl.toggleDevice = function () {
          DeviceManager.toggleDevice(ctrl.device);
        };

        ctrl.getState = function () {
          return DeviceManager.getState(ctrl.device);
        };

        ctrl.buttonText = function () {
          if (ctrl.device.motorized) {
            return ctrl.device.state.on ? 'Bring Down' : 'Bring Up';
          } else {
            return ctrl.device.state.on ? 'Turn Off' : 'Turn On';
          }
        };

        ctrl.setLevel = function () {
          DeviceManager.setLevel(ctrl.device);
        };

      }
    };
  });

})();
