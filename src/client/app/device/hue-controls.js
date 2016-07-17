'use strict';

(function() {

  angular.module('app')
    .component('hueControls', {
      bindings: {
        device: '='
      },
      templateUrl: 'app/device/hue-controls.html',

      controller: function(Link) {
        var ctrl = this;

        ctrl.colors = [
          { name: 'Deep Orange', value: 3000 },
          { name: 'Yellow', value: 12750 },
          { name: 'Green', value: 25500 },
          { name: 'Blue', value: 46920 },
          { name: 'Pink', value: 56100 },
          { name: 'Red', value: 65280 }
        ];

        ctrl.updateHue = function(asd) {
          console.log('update hue', asd);
        };

        ctrl.hasLink = function(rel) {
          return Link.hasLink(ctrl.device, rel);
        };

        ctrl.getLink = function(rel) {
          return Link.getLink(ctrl.device, rel);
        };

        ctrl.handleLink = function(rel, value) {
          var link = ctrl.getLink(rel);
          Link.linkAction(link, value).then(function(data) {
            console.log(data);
            //DeviceManager.refresh();
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
