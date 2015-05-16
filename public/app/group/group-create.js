(function () {

  var module = angular.module('group');

  module.controller('GroupCreateCtrl', function (MasterApi, Message) {

    var ctrl = this;

    ctrl.devices = [];
    ctrl.groups = [];
    ctrl.selectedDevice = {};
    ctrl.selectedDevices = [];

    ctrl.selectedGroup = {};
    ctrl.selectedGroups = [];

    ctrl.group = {
      name: '',
      items: []
    };

    function fetchDevicesAndGroups() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
        ctrl.selectedDevice = ctrl.devices[0];
      });

      MasterApi.getGroups().then(function (groups) {
        ctrl.groups = groups;
        ctrl.selectedGroup = ctrl.groups[0];
      });
    }

    fetchDevicesAndGroups();


    ctrl.addDevice = function () {
      var device = JSON.parse(ctrl.selectedDevice);
      ctrl.selectedDevices.push(device);
      ctrl.selectedDevice = {};
      //ctrl.devices.splice(index, 1);
    };

    ctrl.addGroup = function () {
      var group = JSON.parse(ctrl.selectedGroup);
      ctrl.selectedGroups.push(group);
      ctrl.selectedGroup = {};
      //ctrl.groups.splice(index, 1);
    };

    ctrl.isEmptyGroup = function () {
      return (ctrl.selectedDevices.length + ctrl.selectedGroups.length) === 0;
    };

    ctrl.isValid = function () {
      var valid = true;
      if (ctrl.group.name === '') {
        valid = false;
        Message.warning('Please enter a name!');
      } else if (ctrl.isEmptyGroup()){
        valid = false;
        Message.warning('Please add something to the group!');
      }

      return valid;
    };

    ctrl.saveGroup = function () {

      if (!ctrl.isValid()) {
        return;
      }

      // Merge devices and groups
      var items = ctrl.selectedDevices.concat(ctrl.selectedGroups);
      ctrl.group.items = items.map(function (item) {
        var a = {};
        a.id = item.id;
        a.type = item.type;
        return a;
      });

      MasterApi.createGroup(ctrl.group).then(function () {
        console.log('Saved!');
        Message.success('Group created!');
        ctrl.group.name = '';
        ctrl.group.items = [];
        ctrl.selectedDevice = ctrl.devices[0];
        ctrl.selectedDevices = [];
        ctrl.selectedGroup = ctrl.groups[0];
        ctrl.selectedGroups = [];
      });
    }
  });

  module.directive('groupCreate', function () {
    return {
      scope: {},
      templateUrl: 'app/group/group-create.html',
      controller: 'GroupCreateCtrl',
      controllerAs: 'ctrl'
    }
  });

})();
