'use strict';

(function() {

  angular.module('app').component('deviceConfig', {
    templateUrl: 'app/device/device-config.html',
    bindings: {
    },
    controller: function($rootScope, Devices, Socket) {
      var ctrl = this;

      var visible = false;
      ctrl.selectedDevice = null;

      $rootScope.$on('show-device-config', function(event, device) {
        //Devices.selectDevice(device);
        ctrl.selectedDevice = device;
        visible = true;
      });

      ctrl.isHueDevice = function() {
        return ctrl.selectedDevice !== null && ctrl.selectedDevice.type === 'hue-device';
      };

      ctrl.isVisible = function() {
        return visible;
      }

      ctrl.close = function() {
        visible = false;
        ctrl.selectedDevice = null;
      };

    }
  });

})();
