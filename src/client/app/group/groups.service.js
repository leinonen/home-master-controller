'use strict';

(function() {

  angular.module('app')
    .service('Groups', function($rootScope, $timeout, GroupsResource, ErrorHandler) {
      var service = this;

      var groupList = [];

      service.getGroups = function(){
        return GroupsResource.query().$promise.then(function(response) {
          console.log('got groups', response);
          groupList = response;
          return groupList;
        }).catch(ErrorHandler.handle);
      };

      $rootScope.$on('sync-device', function(event, deviceControlSuccess) {

        var matchDevice = function(dev) {
          return dev.type === deviceControlSuccess.type && dev.id === deviceControlSuccess.id;
        };

        var updateDeviceState = function(dev) {
          if (deviceControlSuccess.action === 'on') {
            dev.state.on = true;
          }
          if (deviceControlSuccess.action === 'off') {
            dev.state.on = false;
          }
        };

        $timeout(function() {
          groupList.forEach(function(g) {
            g.items.filter(matchDevice).forEach(updateDeviceState);
            g.state.on = g.items.every(function(i) {
              return i.state.on === true;
            });
          });

        }, 10)
      });



    });

})();
