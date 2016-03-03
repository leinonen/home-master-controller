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

      controller: function (DeviceManager, Link) {
        var ctrl = this;

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
          })
        };

        ctrl.colorLoopText = function () {
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
    };
  });

})();
