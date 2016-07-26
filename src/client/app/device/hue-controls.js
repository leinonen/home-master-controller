'use strict';

(function() {

  angular.module('app')
    .component('hueControls', {
      bindings: {
        device: '='
      },
      templateUrl: 'app/device/hue-controls.html',

      controller: function($scope, Socket) {
        var ctrl = this;

        ctrl.colors = [
          {name: 'Deep Orange', value: 3000},
          {name: 'Yellow', value: 12750},
          {name: 'Green', value: 25500},
          {name: 'Blue', value: 46920},
          {name: 'Pink', value: 56100},
          {name: 'Red', value: 65280}
        ];

        // Watch for hue changes, send socket command
        $scope.$watch(
          function() {
            return this.device.state.hue;
          }.bind(this),
          function() {
            ctrl.setHue();
          }.bind(this)
        );

        ctrl.setBrightness = function() {
          Socket.hueCommand({
            id: ctrl.device.id,
            params: {
              type: ctrl.device.type,
              action: 'bri',
              value: ctrl.device.state.bri
            }
          });
        };

        ctrl.setSaturation = function() {
          Socket.hueCommand({
            id: ctrl.device.id,
            params: {
              type: ctrl.device.type,
              action: 'sat',
              value: ctrl.device.state.sat
            }
          });
        };

        ctrl.setHue = function() {
          Socket.hueCommand({
            id: ctrl.device.id,
            params: {
              type: ctrl.device.type,
              action: 'hue',
              value: ctrl.device.state.hue
            }
          });
        };

        ctrl.enableColorLoop = function() {
          Socket.hueCommand({
            id: ctrl.device.id,
            params: {
              type: ctrl.device.type,
              action: 'colorloop-on'
            }
          });
        };

        ctrl.disableColorLoop = function() {
          Socket.hueCommand({
            id: ctrl.device.id,
            params: {
              type: ctrl.device.type,
              action: 'colorloop-off'
            }
          });
        };

        ctrl.colorLoopText = function() {
          return ctrl.device.state.effect === 'none' ? 'Enable' : 'Disable';
        };

      }
    });

})();
