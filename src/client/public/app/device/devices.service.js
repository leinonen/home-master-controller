(function() {

  angular.module('app')
    .service('Devices', function($rootScope, $http, $timeout, ErrorHandler, Link, DevicesResource) {
      var service = this;
      var model = {};
      var selectedDevice;

      DevicesResource.query().$promise.then(function(response) {
        model = response;
      })
      .catch(ErrorHandler.handle);

      service.sync = function(id, type) {
        DevicesResource.query({id: id, type: type}).$promise.then(function(response) {
          model.devices
            .filter(device => device.id === id && device.type === type)
            .forEach(d => {
              d = response.device; // Remove Links, then we can use response directly
              console.log('Synced device: ', d.name, 'state:', d.state.on);
            });

          })
          .catch(ErrorHandler.handle);
      };

      service.update = function(data) {
        model.devices = data;
      };

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
