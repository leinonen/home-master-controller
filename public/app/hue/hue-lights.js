(function () {

  var module = angular.module('hue');


  module.controller('HueLightsCtrl', function (MasterApi) {

    var ctrl = this;
    ctrl.lights = [];

    function getLights() {
      MasterApi.getHueLights().then(function (lights) {
        ctrl.lights = lights;
      });
    }

    getLights();

    ctrl.toggleLight = function (light) {
      if (light.state.on === true) {
        MasterApi.hueOff(light.id).then(function (response) {
          getLights();
        });
      } else {
        MasterApi.hueOn(light.id).then(function (response) {
          getLights();
        });
      }
    };

    ctrl.getButtonText = function (light) {
      return light.state.on === true ? 'Turn Off' : 'Turn On';
    }

  });


  module.directive('hueLights', function () {
    return {
      scope: {},
      templateUrl: 'app/hue/hue-lights.html',
      replace: true,
      controller: 'HueLightsCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
