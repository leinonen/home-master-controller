(function() {

  angular.module('app')
    .service('Devices', function($rootScope, $http, $timeout, ErrorHandler, Link, DevicesResource) {
      var service = this;
      var model = {};
      var selectedDevice;

      $rootScope.$on('fetchDevices', function(event, message) {
        $timeout(function() {
          DevicesResource.query().$promise.then(function(response) {
              model = response;
            })
            .catch(ErrorHandler.handle);
        }, 200);
      });

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if (toState.name === 'root.devices') {
          $rootScope.$emit('fetchDevices');
        }
      });

      service.getDevices = function() {
        return model.devices || [];
      };

      service.selectDevice = function(device) {
        selectedDevice = device;
      };

      service.isDeviceSelected = function(device) {
        return selectedDevice && device.id === selectedDevice.id;
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
