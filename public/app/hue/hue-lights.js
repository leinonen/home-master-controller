(function () {

  var module = angular.module('hue');


  module.controller('HueLightsCtrl', function ($rootScope, MasterApi) {

    var ctrl = this;
    ctrl.lights = [];

    function getLights() {
      MasterApi.getHueLights().then(function (lights) {
        ctrl.lights = lights;
      });
    }

    getLights();

    $rootScope.$on('update.lights', getLights);

    ctrl.toggleLight = function (light) {
      if (light.state.on === true) {
        MasterApi.hueOff(light.id).then(function (response) {
          $rootScope.$emit('light.off', light.id);
          getLights();
        });
      } else {
        MasterApi.hueOn(light.id).then(function (response) {
          $rootScope.$emit('light.on', light.id);
          getLights();
        });
      }
    };

    ctrl.getButtonText = function (light) {
      return light.state.on === true ? 'Turn Off' : 'Turn On';
    };


    ctrl.setBrightness = function (index, light) {
      console.log(light.id + ' ' + light.state.bri);
      MasterApi.hueLightBrightness(light.id, light.state.bri).then(function(response){
        console.log('updated brightness for light ' + light.id + ' with value ' + light.state.bri);
        //ctrl.lights[index].state.bri = light.state.bri;
        getLights();
      });
    };

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
