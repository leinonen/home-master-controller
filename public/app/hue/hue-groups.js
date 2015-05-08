(function () {

  var module = angular.module('hue');


  module.controller('HueGroupsCtrl', function (MasterApi) {

    var ctrl = this;
    ctrl.lights = [];

    function getGroups() {
      MasterApi.getHueGroups().then(function(groups){
        console.log(groups);
        ctrl.lights = groups;
      });
    }

    getGroups();

  });


  module.directive('hueGroups', function () {
    return {
      scope: {},
      templateUrl: 'app/hue/hue-groups.html',
      replace: true,
      controller: 'HueGroupsCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
