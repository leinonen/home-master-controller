'use strict';

angular.module('app')
  .factory('DevicesResource', function($resource) {
    return $resource('/api/devices/:type/:id/:controller', {
        type: '@type',
        id: '@id'
      },
      {
        query: {
          method: 'GET',
          isArray: true
        },
        get: {
          method: 'GET'
        }
      });
  });
