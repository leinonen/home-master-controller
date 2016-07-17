'use strict';

(function() {

  angular.module('app')
    .service('Groups', function($rootScope, GroupsResource) {
      var service = this;
      var model = {
        groups: []
      };

      GroupsResource.query().$promise.then(function(group) {

        model.groups = group;
      });

      service.getGroups = function() {
        return model.groups;
      };


    });

})();
