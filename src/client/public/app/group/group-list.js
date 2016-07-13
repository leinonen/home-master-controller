(function() {

  angular.module('app')
    .component('groupList', {
      bindings: {},
      templateUrl: 'app/group/group-list.html',

      controller: function($rootScope, Groups, ErrorHandler, Socket) {
        var ctrl = this;

        ctrl.hasGroups = function() {
          return Groups.getGroups().length > 0;
        };

        ctrl.getGroups = function() {
          return Groups.getGroups();
        };

        ctrl.turnOn = function(group) {
          Socket.turnOnGroup(group.id, group.type);
        };

        ctrl.turnOff = function(group) {
          Socket.turnOffGroup(group.id, group.type);
        };

        ctrl.buttonText = function(group) {
          if (group.motorized) {
            return group.state.on ? 'Bring Down' : 'Bring Up';
          } else {
            return group.state.on ? 'Turn Off' : 'Turn On';
          }
        };

        ctrl.getState = function(group) {
          if (group.motorized) {
            return group.state.on ? 'Up' : 'Down';
          } else {
            return group.state.on ? 'On' : 'Off';
          }
        };

        ctrl.isGeneric = function(group) {
          return group.type === 'generic-group';
        };

      }
    });

})();
