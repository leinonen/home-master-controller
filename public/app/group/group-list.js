(function () {

  var module = angular.module('group', ['hmc', 'device']);

  module.controller('GroupListCtrl', function (MasterApi, DeviceHelper) {
    var ctrl = this;
    this.lights = [];

    function updateGroups() {
      MasterApi.getGroups().then(function (groups) {
        ctrl.lights = groups;
      });
    }

    updateGroups();

    ctrl.getSupportedMethods = function (group) {
      return DeviceHelper.getSupportedMethods(group);
    };

    ctrl.getStates = function (group) {
      return DeviceHelper.getStates(group);
    };

    function updateSuccess(status) {
      if (status === 'success') {
        updateGroups();
      } else {
        console.log(status);
      }
    }

    ctrl.turnOn = function (index, group) {
      if (DeviceHelper.isMotorized(group)) {
        MasterApi.goUp(group.id).then(updateSuccess);
      } else {
        MasterApi.turnOn(group.id).then(updateSuccess);
      }
    };

    ctrl.turnOff = function (index, group) {
      if (DeviceHelper.isMotorized(group)) {
        MasterApi.goDown(group.id).then(updateSuccess);
      } else {
        MasterApi.turnOff(group.id).then(updateSuccess);
      }
    };

  });

  module.directive('groupList', function () {
    return {
      scope: {},
      templateUrl: 'app/group/group-list.html',
      replace: true,
      controller: 'GroupListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
