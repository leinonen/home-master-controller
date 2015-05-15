(function () {

  var module = angular.module('group');

  module.controller('EditGroupCtrl', function ($stateParams, MasterApi, Message) {
    var ctrl = this;
    ctrl.group = {};
    ctrl.groupDevices = [];

    function getGroupAndDevices() {
      MasterApi.getGroup($stateParams.id, $stateParams.type).then(function (group) {
        ctrl.group = group;

        MasterApi.getGroupDevices(group.id, group.type).then(function (devices) {
          ctrl.groupDevices = devices;
        }).catch(function (err) {
          Message.danger(err.data.message);
        });

      }).catch(function (err) {
        Message.danger(err.data.message);
      });
    }

    getGroupAndDevices();

    ctrl.saveGroup = function () {
      Message.info('Not implemented');
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
