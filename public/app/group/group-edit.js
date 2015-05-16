(function () {

  var module = angular.module('group');

  module.controller('EditGroupCtrl', function ($rootScope, $q, $stateParams, MasterApi, Message) {
    var ctrl = this;
    ctrl.groupDevices = [];
    ctrl.devices = [];
    ctrl.groups = [];
    ctrl.selectedItems = [];

    ctrl.group = {
      name: '',
      items: []
    };

    function fetchDevicesAndGroups() {
      var promises = [];
      promises.push(MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
      }));
      promises.push(MasterApi.getGroups().then(function (groups) {
        ctrl.groups = groups.filter(function (grp) {
          return grp.type !== 'generic-group';
        });
      }));
      return $q.all(promises);
    }

    function getGroupAndDevices() {
      MasterApi.getGroup($stateParams.id, $stateParams.type).then(function (group) {
        ctrl.group = group;

        MasterApi.getGroupDevices(group.id, group.type).then(function (devices) {
          ctrl.groupDevices = devices;
          ctrl.groupDevices.forEach(function (device) {
            if (device.type === 'telldus-device' || device.type === 'hue-device' ||
                device.type === 'telldus-group' || device.type === 'hue-group') {
              ctrl.selectedItems.push(device);
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

    ctrl.removeItem = function (index) {
      ctrl.selectedItems.splice(index, 1);
    };

    $rootScope.$on('item.selected', function (event, data) {
      if (data.type === 'telldus-device' || data.type === 'hue-device' ||
          data.type === 'telldus-group' || data.type === 'hue-group') {
        ctrl.selectedItems.push(data);
      }
    });

    ctrl.isEmptyGroup = function () {
      return ctrl.selectedItems.length === 0;
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
      ctrl.group.items = ctrl.selectedItems.map(function (item) {
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
        ctrl.selectedItems = [];
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
