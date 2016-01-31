(function () {

  angular.module('app').directive('hueControls', function () {
    return {
      scope: {
        device: '='
      },
      templateUrl: 'app/device/hue-controls.html',
      replace: true,
      controllerAs: 'ctrl',
      bindToController: true,

      controller: function (DeviceManager) {
        var ctrl = this;

        ctrl.colorLoopText = function () {
          return ctrl.device.state.effect === 'none' ? 'Enable' : 'Disable';
        };

        ctrl.toggleColorLoop = function () {
          DeviceManager.toggleColorLoop(ctrl.device);
        };

        ctrl.setBrightness = function () {
          DeviceManager.setBrightness(ctrl.device);
        };

        ctrl.setSaturation = function () {
          DeviceManager.setSaturation(ctrl.device);
        };

        ctrl.setHue = function () {
          DeviceManager.setHue(ctrl.device);
        };

      }
    };
  });

})();
