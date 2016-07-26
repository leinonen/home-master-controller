'use strict';

(function() {

  angular.module('app')
    .service('Devices', function($rootScope, $http, $timeout, ErrorHandler, DevicesResource) {
      var service = this;

      //var devices = [];
      var selectedDevice = null;

      var model = {
        devices: []
      };

      service.fetch = function() {
        DevicesResource.query().$promise.then(function(response) {
            model.devices = response;
          })
          .catch(ErrorHandler.handle);
      };
      service.fetch(); // Initial fetch

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
          model.devices.filter(matchDevice).forEach(updateDeviceState);
        }, 10);

      });

      service.getModel = function() {
        return model;
      };

      service.selectDevice = function(device) {
        selectedDevice = device;
        console.log('selectedDevice', selectedDevice);
      };

      service.isDeviceSelected = function(device) {
        return selectedDevice && device.id === selectedDevice.id;
      };

      service.getSelectedDevice = function() {
        return selectedDevice;
      };

    });

})();
