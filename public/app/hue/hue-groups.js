(function () {

  var module = angular.module('hue');


  module.controller('HueGroupsCtrl', function ($rootScope, MasterApi) {

    var ctrl = this;
    ctrl.lights = [];

    function getGroups() {
      MasterApi.getHueGroups().then(function (groups) {
        ctrl.lights = groups;
      });
    }

    getGroups();

    $rootScope.$on('light.on', function (id) {
      getGroups();
    });

    $rootScope.$on('light.off', function (id) {
      getGroups();
    });

    ctrl.toggleGroup = function (group) {
      if (group.action.on) {
        MasterApi.hueGroupOff(group.id).then(function (response) {
          getGroups();
          $rootScope.$emit('update.lights');
        });
      } else {
        MasterApi.hueGroupOn(group.id).then(function (response) {
          getGroups();
          $rootScope.$emit('update.lights');
        });
      }
    };

    ctrl.getButtonText = function (group) {
      return group.action.on ? 'Turn Off' : 'Turn On';
    };

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
