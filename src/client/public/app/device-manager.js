(function() {

  angular.module('app')
    .service('DeviceManager', function($rootScope, $timeout, MasterApi, Message) {
      var devices = [];
      var controlsEnabled = {};

      var fetchDevices = function() {
        MasterApi.getDevices().then(function(deviceList) {
          devices = deviceList;
        });
      };

      fetchDevices();

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if (toState.name === 'root.devices') {
          console.log('fetching devices');
          fetchDevices();
        }
      });

      var updateDevice = function(device) {
        MasterApi.getDevice(device.id, device.type).then(function(dev) {
          for (var i = 0; i < devices.length; i++) {
            if (devices[i].id === dev.id) {
              devices[i] = dev;
              break;
            }
          }
        })
        .catch(function(err) {
          Message.danger(err.data.statusCode + ' : ' + err.data.message);
        });
      };

      var control = function(device, params) {
        params.type = device.type;
        MasterApi.control(device.id, params).then(function(status) {
          $timeout(function() {
            updateDevice(device);
          }, 200);
        })
        .catch(function(err) {
          Message.danger(err.data.statusCode + ' : ' + err.data.message);
        });
      };

      this.getDevices = function() {
        return devices;
      };

      this.showControls = function(device) {
        return controlsEnabled[device.id] === true;
      };

      this.toggleShowControls = function(device) {
        controlsEnabled[device.id] = !controlsEnabled[device.id] || false;
      };

      this.toggleDevice = function (device) {
        if (device.state.on) {
          control(device, {action: device.motorized ? 'down' : 'off'});
        } else {
          control(device, {action: device.motorized ? 'up' : 'on'});
        }
      };

      this.toggleColorLoop = function (device) {
        if (device.state.effect === 'none') {
          control(device, {action: 'colorloop-on'});
        } else {
          control(device, {action: 'colorloop-off'});
        }
      };

      this.setLevel = function (device) {
        control(device, {action: 'level', value: device.state.level});
      };

      this.setBrightness = function (device) {
        control(device, {action: 'bri', value: device.state.bri});
      };

      this.setSaturation = function (device) {
        control(device, {action: 'sat', value: device.state.sat});
      };

      this.setHue = function (device) {
        control(device, {action: 'hue', value: device.state.hue});
      };


    });

})();
