'use strict';

(function() {

  angular.module('app')
    .component('deviceList', {
      bindings: {},
      templateUrl: 'app/device/device-list.html',
      controller: function($rootScope, Devices) {
        var ctrl = this;

        //$rootScope.$emit('fetchDevices');

        ctrl.devices = function() {
          return Devices.getDevices();
        };

        ctrl.showDevices = function() {
          return Devices.getDevices().length > 0;
        };

      }

    });

})();
