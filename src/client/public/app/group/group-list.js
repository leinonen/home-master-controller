(function() {

  angular.module('app')
    .component('groupList', {
      bindings: {},
      templateUrl: 'app/group/group-list.html',

      controller: function($rootScope, Groups, ErrorHandler, Link) {
        var ctrl = this;

        $rootScope.$emit('fetchGroups');

        ctrl.hasGroups = function() {
          return Groups.getGroups().length > 0;
        };

        ctrl.getGroups = function() {
          return Groups.getGroups();
        };

        ctrl.hasLink = function(group, rel) {
          return Link.hasLink(group, rel);
        };

        ctrl.getLink = function(group, rel) {
          return Link.getLink(group, rel);
        };

        ctrl.handleLink = function(group, rel, value) {
          var link = ctrl.getLink(group, rel);
          Link.linkAction(link, value).then(function(data) {
            console.log(data);
            //DeviceManager.refresh();
          })
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
