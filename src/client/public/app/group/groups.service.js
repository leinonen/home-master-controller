(function() {

  angular.module('app')
    .service('Groups', function($rootScope, GroupsResource, ErrorHandler, Link) {
      var service = this;
      var model = {};

      $rootScope.$on('fetchGroups', function(event, message) {
        GroupsResource.query().$promise.then(function(group) {
          model = group;
        });
      });

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if (toState.name === 'root.groups') {
          $rootScope.$emit('fetchGroups');
        }
      });

      service.getGroups = function() {
        return model.groups || [];
      };

      service.getLinks = function() {
        return model.links || [];
      };

      service.hasLink = function(rel) {
        return Link.hasLink(model, rel);
      };

      service.getLink = function(rel) {
        return Link.getLink(model, rel);
      };

    });

})();
