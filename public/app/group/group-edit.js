(function () {

  var module = angular.module('group');

  module.controller('EditGroupCtrl', function ($q, $stateParams, MasterApi, Message) {
    var ctrl = this;
    ctrl.groupDevices = [];

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
      var promises = [];
      promises.push(MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
        ctrl.selectedDevice = ctrl.devices[0];
      }));

      promises.push(MasterApi.getGroups().then(function (groups) {
        ctrl.groups = groups.filter(function(grp){
          return grp.type !== 'generic-group';
        });
        ctrl.selectedGroup = ctrl.groups[0];
      }));
      return $q.all(promises);
    }

    function getGroupAndDevices() {
      MasterApi.getGroup($stateParams.id, $stateParams.type).then(function (group) {
        ctrl.group = group;

        MasterApi.getGroupDevices(group.id, group.type).then(function (devices) {
          ctrl.groupDevices = devices;
          ctrl.groupDevices.forEach(function (device) {
            if (device.type === 'telldus-device' || device.type === 'hue-device') {
              ctrl.selectedDevices.push(device);
            }
            if (device.type === 'telldus-group' || device.type === 'hue-group' || device.type === 'generic-group') {
              ctrl.selectedGroups.push(device);
            }
          });
        }).catch(function (err) {
          Message.danger(err.data.message);
        });

      }).catch(function (err) {
        Message.danger(err.data.message);
      });
    }

    fetchDevicesAndGroups().then(function () {
      getGroupAndDevices();
    });

    ctrl.removeDevice = function (index) {
      ctrl.selectedDevices.splice(index, 1);
    };

    ctrl.removeGroup = function (index) {
      ctrl.selectedGroups.splice(index, 1);
    };

    ctrl.addDevice = function (device) {
      ctrl.selectedDevice = (typeof device === 'string') ? JSON.parse(device) : device;
      ctrl.selectedDevices.push(ctrl.selectedDevice);
      ctrl.selectedDevice = {};
    };

    ctrl.addGroup = function (group) {
      ctrl.selectedGroup = (typeof group === 'string') ? JSON.parse(group) : group;
      ctrl.selectedGroups.push(ctrl.selectedGroup);
      ctrl.selectedGroup = {};
    };

    ctrl.isEmptyGroup = function () {
      return (ctrl.selectedDevices.length + ctrl.selectedGroups.length) === 0;
    };

    ctrl.isValid = function () {
      var valid = true;
      if (ctrl.group.name === '') {
        valid = false;
        Message.warning('Please enter a name!');
      } else if (ctrl.isEmptyGroup()) {
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

      MasterApi.updateGroup(ctrl.group.id, ctrl.group).then(function () {
        console.log('Saved!');
        Message.success('Group saved successfully!');
        ctrl.group.name = '';
        ctrl.group.items = [];
        ctrl.selectedDevice = ctrl.devices[0];
        ctrl.selectedDevices = [];
        ctrl.selectedGroup = ctrl.groups[0];
        ctrl.selectedGroups = [];
      });
    };

    ctrl.deleteGroup = function () {
      MasterApi.deleteGroup(ctrl.group.id).then(function (response) {
        Message.info(response);
        ctrl.group = {};
      });
    }

  });

  module.directive('groupEdit', function () {
    return {
      scope: {},
      templateUrl: 'app/group/group-edit.html',
      controller: 'EditGroupCtrl',
      controllerAs: 'ctrl'
    }
  });


})();
