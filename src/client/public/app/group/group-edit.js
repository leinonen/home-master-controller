(function() {

  var module = angular.module('app');

  module.controller('GroupCtrl', function($rootScope, $q, $state, $stateParams, MasterApi, Message) {
    var ctrl = this;
    ctrl.groupDevices = [];
    ctrl.devices = [];
    ctrl.selectedItems = [];
    ctrl.group = {
      name: '',
      items: []
    };

    ctrl.isEditMode = function() {
      return $stateParams.id !== undefined;
    };

    function fetchDevicesAndGroups() {
      var promises = [];
      promises.push(MasterApi.getDevices());
      promises.push(MasterApi.getGroups());
      return $q.all(promises).then(function(items) {
        ctrl.devices = items[0].concat(items[1]);
      });
    }

    function getGroupAndDevices() {
      MasterApi
        .getGroup($stateParams.id, $stateParams.type)
        .then(function(group) {
          ctrl.group = group;

          MasterApi
            .getGroupDevices(group.id, group.type)
            .then(function(devices) {
              ctrl.groupDevices = devices;
              ctrl.groupDevices.forEach(function(device) {
                ctrl.selectedItems.push(device);
              });
            }).catch(function(err) {
              Message.danger(err.data.message);
            });

        }).catch(function(err) {
          Message.danger(err.data.message);
        });
    }

    fetchDevicesAndGroups().then(function() {
      if (ctrl.isEditMode()) {
        getGroupAndDevices();
      }
    });

    ctrl.removeItem = function(index) {
      ctrl.selectedItems.splice(index, 1);
    };

    $rootScope.$on('item.selected', function(event, data) {
      if (data.id) {
        ctrl.selectedItems.push(data);
      }
    });

    ctrl.isEmptyGroup = function() {
      return ctrl.selectedItems.length === 0;
    };

    ctrl.isValid = function() {
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

    var addSelectedItems = function() {
      ctrl.group.items = ctrl.selectedItems.map(function(item) {
        return { id: item.id, type: item.type };
      });
    };

    var handleResponse = function() {
      Message.success('Success!');
      ctrl.group.name = '';
      ctrl.group.items = [];
      ctrl.selectedItems = [];
      $state.go('root.groups');
    };

    ctrl.saveGroup = function() {
      if (ctrl.isValid()) {
        addSelectedItems();
        MasterApi
          .createGroup(ctrl.group)
          .then(handleResponse);
      }
    };

    ctrl.updateGroup = function() {
      if (ctrl.isValid()) {
        addSelectedItems();
        MasterApi
          .updateGroup(ctrl.group.id, ctrl.group)
          .then(handleResponse);
      }
    };

    ctrl.save = function() {
      if (ctrl.isEditMode()) {
        ctrl.updateGroup();
      } else {
        ctrl.saveGroup();
      }
    };

    ctrl.deleteGroup = function() {
      MasterApi
        .deleteGroup(ctrl.group.id)
        .then(function(response) {
          Message.info(response);
          ctrl.group = {};
          $state.go('root.groups');
        });
    }

  });

  module.directive('groupEdit', function() {
    return {
      scope: {},
      templateUrl: 'app/group/group-edit.html',
      controller: 'GroupCtrl',
      controllerAs: 'ctrl'
    }
  });


})();
