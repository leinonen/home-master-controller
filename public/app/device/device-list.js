(function () {

  var module = angular.module('device');

  module.controller('DeviceListCtrl', function (MasterApi) {
    var ctrl = this;
    this.devices = [];

    function fetchDevices() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
        console.log('got device list');
      });
    }

    fetchDevices();

    function control(id, params){
      MasterApi.control(id, params).then(function (status) {
        console.log(status);
        setTimeout(fetchDevices, 100);
      }).catch(console.error);
    }

    ctrl.turnOn = function (device) {
      control(device.id, { type: device.type, action: device.motorized ? 'up' : 'on' });
    };

    ctrl.turnOff = function (device) {
      control(device.id, { type: device.type, action: device.motorized ? 'down' : 'off' });
    };

    ctrl.setBrightness = function (device) {
      control(device.id, { type: device.type, action: 'bri', value: device.state.bri });
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
