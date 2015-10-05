(function () {

  var module = angular.module('app');

  module.controller('GroupCreateCtrl', function ($state, $rootScope, MasterApi, Message) {

    var ctrl = this;

    ctrl.devices = [];
    ctrl.groups = [];
    ctrl.selectedItems = [];

    ctrl.group = {
      name: '',
      items: []
    };

    function fetchDevicesAndGroups() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
      });

      MasterApi.getGroups().then(function (groups) {
        ctrl.groups = groups;
      });
    }

    fetchDevicesAndGroups();


    $rootScope.$on('item.selected', function (event, data) {
       ctrl.selectedItems.push(data);
    });

    ctrl.removeItem = function (index) {
      ctrl.selectedItems.splice(index, 1);
    };


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

      ctrl.group.items = ctrl.selectedItems.map(function (item) {
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
        ctrl.selectedItems = [];
        $state.go('root.groups');
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
