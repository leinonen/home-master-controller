(function () {

  var module = angular.module('device');

  module.controller('DeviceListCtrl', function ($rootScope, $timeout, MasterApi, Message) {
    var ctrl = this;
    ctrl.devices = [];
    ctrl.controlsActive = {};

    ctrl.showControls = function(device) {
      return ctrl.controlsActive[device.id] === true;
    };

    ctrl.toggleShowControls = function(device) {
      if (ctrl.controlsActive[device.id] === undefined) {
        ctrl.controlsActive[device.id] = true;
      } else {
        ctrl.controlsActive[device.id] = !ctrl.controlsActive[device.id];
      }
    };

    function fetchDevices() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
      }).catch(function (err) {
        Message.danger(err.data.statusCode + ' : ' + err.data.message);
      });
    }

    fetchDevices();


    function fetchAndUpdate(device) {
      $timeout(function () {
        MasterApi.getDevice(device.id, device.type)
        .then(function(dev) {
          for(var i=0; i<ctrl.devices.length; i++){
            if (ctrl.devices[i].id === dev.id) {
              ctrl.devices[i] = dev;
              break;
            }
          }
        })
        .catch(function (err) {
          Message.danger(err.data.statusCode + ' : ' + err.data.message);
        });
      }, 150);
    }


    function control(device, params) {
      params.type = device.type;
      MasterApi.control(device.id, params)
      .then(function(status) {
        fetchAndUpdate(device);
      })
      .catch(console.error);
    }

    ctrl.showDevices = function () {
      return ctrl.devices.length > 0;
    };


    ctrl.getState = function (device) {
      if (device.motorized) {
        return device.state.on ? 'Up' : 'Down';
      } else {
        return device.state.on ? 'On' : 'Off';
      }
    };

    ctrl.buttonText = function (device) {
      if (device.motorized) {
        return device.state.on ? 'Bring Down' : 'Bring Up';
      } else {
        return device.state.on ? 'Turn Off' : 'Turn On';
      }
    };

    ctrl.colorLoopText = function (device) {
      return device.state.effect === 'none' ? 'Enable' : 'Disable';
    };

    ctrl.toggleColorLoop = function (device) {
      if (device.state.effect === 'none') {
        control(device, {action: 'colorloop-on'});
      } else {
        control(device, {action: 'colorloop-off'});
      }
    };

    ctrl.toggleDevice = function (device) {
      if (device.state.on) {
        control(device, {action: device.motorized ? 'down' : 'off'});
      } else {
        control(device, {action: device.motorized ? 'up' : 'on'});
      }
    };

    ctrl.setBrightness = function (device) {
      control(device, {action: 'bri', value: device.state.bri});
    };

    ctrl.setSaturation = function (device) {
      control(device, {action: 'sat', value: device.state.sat});
    };

    ctrl.setHue = function (device) {
      control(device, {action: 'hue', value: device.state.hue});
    };

  });

  module.directive('deviceList', function () {
    return {
      scope: {},
      templateUrl: 'app/device/device-list.html',
      replace: true,
      controller: 'DeviceListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
