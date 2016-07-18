'use strict';

(function() {

  angular.module('app')
    .component('deviceList', {
      bindings: {},
      templateUrl: 'app/device/device-list.html',
      controller: function($rootScope, Devices) {
        var ctrl = this;

        ctrl.getDevices = function() {
          return Devices.getModel().devices;
        };

        ctrl.showDevices = function() {
          return Devices.getModel().devices.length > 0;
        };

      }

    });

})();
