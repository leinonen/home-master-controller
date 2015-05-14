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

    function control(id, params) {
      MasterApi.control(id, params).then(function (status) {
        console.log(status);
        setTimeout(updateGroups, 100);
      }).catch(console.error);
    }

    ctrl.buttonText = function (group) {
      if (group.motorized) {
        return group.state.on ? 'Bring Down' : 'Bring Up';
      } else {
        return group.state.on ? 'Turn Off' : 'Turn On';
      }
    };

    ctrl.getState = function (group) {
      if (group.motorized) {
        return group.state.on ? 'Up' : 'Down';
      } else {
        return group.state.on ? 'On' : 'Off';
      }
    };

    ctrl.toggleGroup = function (group) {
      if (group.state.on) {
        control(group.id, {type: group.type, action: group.motorized ? 'down' : 'off'});
      } else {
        control(group.id, {type: group.type, action: group.motorized ? 'up' : 'on'});
      }
    };
    /*    ctrl.turnOn = function (group) {
     control(group.id, { type: group.type, action: group.motorized ? 'up' : 'on' });
     };

     ctrl.turnOff = function (group) {
     control(group.id, { type: group.type, action: group.motorized ? 'down' : 'off' });
     };*/

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
