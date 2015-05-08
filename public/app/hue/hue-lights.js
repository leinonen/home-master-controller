(function () {

  var module = angular.module('hue', ['hmc']);


  module.controller('HueListCtrl', function (MasterApi) {

    var ctrl = this;
    ctrl.lights = [];

    function getLights() {
      MasterApi.getHueLights().then(function(lights){
        console.log(lights);
        ctrl.lights = lights;
      });
    }

    getLights();

  });


  module.directive('hueList', function () {
    return {
      scope: {},
      templateUrl: 'app/hue/hue-list.html',
      replace: true,
      controller: 'HueListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
