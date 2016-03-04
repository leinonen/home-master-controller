(function () {

  angular.module('app').directive('deviceCard', function () {
    return {
      scope: {
        device: '=',
        controls: '='
      },
      templateUrl: 'app/device/device-card.html',
      replace: true,
      controllerAs: 'ctrl',
      bindToController: true,

      controller: function ($rootScope, Devices, Link) {
        var ctrl = this;

        ctrl.showControls = function() {
          return Devices.isDeviceSelected(ctrl.device);
        };

        ctrl.toggleShowControls = function() {
          if (Devices.isDeviceSelected(ctrl.device)) {
            Devices.selectDevice(null);
          } else {
            Devices.selectDevice(ctrl.device);
          }
        };

        ctrl.hasLink = function(rel) {
          return Link.hasLink(ctrl.device, rel);
        };

        ctrl.getLink = function(rel) {
          return Link.getLink(ctrl.device, rel);
        };

        ctrl.handleLink = function(rel, value) {
          var link = ctrl.getLink(rel);
          Link.linkAction(link, value);
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

        ctrl.buttonText = function () {
          if (ctrl.device.motorized) {
            return ctrl.device.state.on ? 'Bring Down' : 'Bring Up';
          } else {
            return ctrl.device.state.on ? 'Turn Off' : 'Turn On';
          }
        };

      }
    };
  });

})();
