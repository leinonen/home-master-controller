(function () {

  var module = angular.module('group');

  module.controller('GroupListCtrl', function (MasterApi) {
    var ctrl = this;
    this.groups = [];

    function updateGroups() {
      MasterApi.getGroups().then(function (groups) {
        ctrl.groups = groups;
        ctrl.groups.filter(function(g){
          return g.type === 'generic-group';
        }).forEach(function(g){
          MasterApi.getGroupState(g.id).then(function(group){
            for (var i=0; i<ctrl.groups.length; i++){
              if (ctrl.groups[i].id === group.id){
                ctrl.groups[i].state.on = group.state.on;
                break;
              }
            }
          });
        });
      });
    }

    updateGroups();

    function control(id, params) {
      MasterApi.control(id, params).then(function (status) {
        console.log(status);
        setTimeout(updateGroups, 250);
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

    ctrl.isGeneric = function(group){
      return group.type === 'generic-group';
    };

    ctrl.sendOn = function (group) {
      control(group.id, {type: group.type, action: 'on'});
    };

    ctrl.sendOff = function (group) {
      control(group.id, {type: group.type, action: 'off'});
    };

    ctrl.toggleGroup = function (group) {
      if (group.state.on) {
        control(group.id, {type: group.type, action: group.motorized ? 'down' : 'off'});
      } else {
        control(group.id, {type: group.type, action: group.motorized ? 'up' : 'on'});
      }
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
