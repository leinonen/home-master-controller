(function () {

  var module = angular.module('device');

  module.controller('DeviceListCtrl', function ($timeout, MasterApi) {
    var ctrl = this;
    ctrl.devices = [];
    ctrl.message = '';

    function fetchDevices() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
        console.log('got device list');
      }).catch(function (err) {
        ctrl.message = err.data.statusCode + ' : ' + err.data.message + ' : ' + err.data.url;
      });
    }

    fetchDevices();

    function control(id, params) {
      MasterApi.control(id, params).then(function (status) {
        console.log(status);
        $timeout(fetchDevices, 100);
      }).catch(console.error);
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

    ctrl.toggleDevice = function (device) {
      if (device.state.on) {
        control(device.id, {type: device.type, action: device.motorized ? 'down' : 'off'});
      } else {
        control(device.id, {type: device.type, action: device.motorized ? 'up' : 'on'});
      }
    };

    ctrl.setBrightness = function (device) {
      control(device.id, {type: device.type, action: 'bri', value: device.state.bri});
    };

    ctrl.setSaturation = function (device) {
      control(device.id, {type: device.type, action: 'sat', value: device.state.sat});
    };

    ctrl.setHue = function (device) {
      control(device.id, {type: device.type, action: 'hue', value: device.state.hue});
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
