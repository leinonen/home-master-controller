(function() {

  angular.module('app')
    .component('groupEdit', {
      bindings: {},
      templateUrl: 'app/group/group-edit.html',
      controller: function($rootScope, $q, $state, $stateParams, MasterApi, Message) {
        var ctrl = this;
        ctrl.devices = [];
        ctrl.group = {
          name: '',
          items: []
        };

        ctrl.isEditMode = function() {
          return $stateParams.id !== undefined;
        };

        function fetchDevicesAndGroups() {
          return MasterApi.getDevices().then(function(items) {
            ctrl.devices = items; //.concat(items[1]);
          });
        }

        function getGroupAndDevices() {
          MasterApi
            .getGroup($stateParams.id, $stateParams.type)
            .then(function(group) {
              ctrl.group = group;

              ctrl.devices.forEach(function(device) {
                group.items.forEach(function(item) {
                  if (item.id == device.id && item.type === device.type) {
                    device.selected = true;
                  }
                });
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


        ctrl.isEmptyGroup = function() {
          return ctrl.devices.filter(function(device) {
            return device.selected === true;
          }).length === 0;
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
          ctrl.group.items = ctrl.devices.filter(function(device) {
            return device.selected === true;
          }).map(function(device) {
            return {id: device.id, type: device.type};
          });
        };

        var handleResponse = function() {
          Message.success('Success!');
          ctrl.group.name = '';
          ctrl.group.items = [];
          //ctrl.selectedItems = [];
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

      }
    });

})();
