'use strict';

(function() {

  angular.module('app')
    .component('hueControls', {
      bindings: {
        device: '='
      },
      templateUrl: 'app/device/hue-controls.html',

      controller: function(Socket) {
        var ctrl = this;

        ctrl.colors = [
          { name: 'Deep Orange', value: 3000 },
          { name: 'Yellow', value: 12750 },
          { name: 'Green', value: 25500 },
          { name: 'Blue', value: 46920 },
          { name: 'Pink', value: 56100 },
          { name: 'Red', value: 65280 }
        ];

        ctrl.setBrightness = function() {
          Socket.hueCommand({
            device: {id: ctrl.device.id, type: ctrl.device.type},
            type: 'set-brightness',
            value: ctrl.device.state.bri
          });
        };

        ctrl.setSaturation = function() {
          Socket.hueCommand({
            device: {id: ctrl.device.id, type: ctrl.device.type},
            type: 'set-saturation',
            value: ctrl.device.state.sat
          });
        };

        ctrl.setHue = function(value) {
          Socket.hueCommand({
            device: {id: ctrl.device.id, type: ctrl.device.type},
            type: 'set-hue',
            value: ctrl.device.state.hue
          });
        };

        ctrl.enableColorLoop = function() {
          Socket.hueCommand({
            device: {id: ctrl.device.id, type: ctrl.device.type},
            type: 'colorloop-enable'
          });
        };

        ctrl.disableColorLoop = function() {
          Socket.hueCommand({
            device: {id: ctrl.device.id, type: ctrl.device.type},
            type: 'colorloop-disable'
          });
        };


        ctrl.colorLoopText = function() {
          return ctrl.device.state.effect === 'none' ? 'Enable' : 'Disable';
        };

        /*        ctrl.toggleColorLoop = function () {
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
         };*/

      }
    });

})();
