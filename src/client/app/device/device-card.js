'use strict';

(function() {

  angular.module('app').component('deviceCard', {
    templateUrl: 'app/device/device-card.html',
    bindings: {
      device: '=',
      controls: '='
    },
    controller: function($rootScope, Devices, Socket) {
      var ctrl = this;

      ctrl.showControls = function() {
        return Devices.isDeviceSelected(ctrl.device);
      };

      ctrl.toggleShowControls = function() {
        /*if (Devices.isDeviceSelected(ctrl.device)) {
          Devices.selectDevice(null);
        } else {
          Devices.selectDevice(ctrl.device);
        }*/
        $rootScope.$emit('show-device-config', ctrl.device);
      };

      ctrl.turnOn = function() {
        Socket.turnOn(ctrl.device.id, ctrl.device.type);
      };

      ctrl.turnOff = function() {
        Socket.turnOff(ctrl.device.id, ctrl.device.type);
      };

      ctrl.controlsEnabled = function() {
        return ctrl.controls === true;
      };

      ctrl.canToggleDevice = function() {
        return ctrl.device.state.on !== undefined;
      };

      ctrl.isHueDevice = function() {
        return ctrl.device.type === 'hue-device';
      };

      ctrl.buttonText = function() {
        if (ctrl.device.motorized) {
          return ctrl.device.state.on ? 'Bring Down' : 'Bring Up';
        } else {
          return ctrl.device.state.on ? 'Turn Off' : 'Turn On';
        }
      };

    }
  });

})();
