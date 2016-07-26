'use strict';

(function() {

  angular.module('app')
    .component('groupList', {
      bindings: {},
      templateUrl: 'app/group/group-list.html',

      controller: function($rootScope, Groups, ErrorHandler, Socket) {
        var ctrl = this;

        var groups = [];

        var fetchGroups = function() {
          Groups.getGroups().then(function(g) {
            groups = g;
          });
        };

        fetchGroups();

        $rootScope.$on('device-sync-complete', function() {
          console.log('got device sync complete message');
          fetchGroups();
        });

        ctrl.getGroups = function() {
          return groups;
        };

        ctrl.hasGroups = function() {
          return groups.length > 0;
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
