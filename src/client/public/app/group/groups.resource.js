'use strict';

angular.module('app')
  .factory('GroupsResource', function ($resource) {
    return $resource('/api/groups/:type/:id/:controller', {
        type: '@type',
        id: '@id'
      },
      {
        query: {
          method: 'GET',
          isArray: false
        },
        get: {
          method: 'GET'
        }
      });
  });
