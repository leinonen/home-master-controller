(function () {

  var module = angular.module('group', ['hmc', 'device']);

  module.controller('GroupListCtrl', function (MasterApi) {
    var ctrl = this;
    this.groups = [];

    function updateGroups() {
      MasterApi.getGroups().then(function (groups) {
        ctrl.groups = groups;
      });
    }

    updateGroups();

    function control(id, params){
      MasterApi.control(id, params).then(function (status) {
        console.log(status);
        setTimeout(updateGroups, 100);
      }).catch(console.error);
    }

    ctrl.turnOn = function (group) {
      control(group.id, { type: group.type, action: group.motorized ? 'up' : 'on' });
    };

    ctrl.turnOff = function (group) {
      control(group.id, { type: group.type, action: group.motorized ? 'down' : 'off' });
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
