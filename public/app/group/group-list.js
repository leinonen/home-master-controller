(function () {

  var module = angular.module('group', ['hmc','device']);

  module.controller('GroupListCtrl', function (MasterApi, DeviceHelper) {
    var ctrl = this;
    this.groups = [];
    MasterApi.getGroups().then(function (groups) {
      ctrl.groups = groups;
    });

    ctrl.getSupportedMethods = function (group) {
      return DeviceHelper.getSupportedMethods(group);
    };

    ctrl.getStates = function (group) {
      return DeviceHelper.getStates(group);
    };

    ctrl.toggleDevice = function (index, device) {
      if (ctrl.isOn(device)) {
        ctrl.turnOff(index, device);
      } else {
        ctrl.turnOn(index, device);
      }
    };

    ctrl.isOff = function (device) {
      //return DeviceHelper.isOff(device);
      return DeviceHelper.getStates(device) === 'off' || DeviceHelper.getStates(device) === 'down';
    };

    ctrl.isOn = function (device) {
      return DeviceHelper.getStates(device) === 'on' || DeviceHelper.getStates(device) === 'up';
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
