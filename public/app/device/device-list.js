(function () {

  var module = angular.module('device', ['hmc']);

  module.controller('DeviceListCtrl', function (MasterApi) {
    var ctrl = this;
    this.devices = [];

    function fetchDevices() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
      });
    }

    function updateDevice(index, id) {
      setTimeout(function () {
        MasterApi.getDevice(id).then(function (device) {
          ctrl.devices[index] = device;
        });
      }, 250); // Must have delay
    }

    fetchDevices();

    ctrl.isOff = function (device) {
      return device.state === 0 || device.state === '0'
    };

    ctrl.isOn = function (device) {
      return device.state === 1 || device.state === '1'
    };

    ctrl.turnOn = function (index, id) {
      MasterApi.turnOn(id).then(function (status) {
        if (status === 'success') {
          console.log('device turned on successfully!');
          updateDevice(index, id);
        } else {
          console.log(status);
        }
      });
    };

    ctrl.turnOff = function (index, id) {
      MasterApi.turnOff(id).then(function (status) {
        if (status === 'success') {
          console.log('device turned off successfully!');
          updateDevice(index, id);
        } else {
          console.log(status);
        }
      });
    }
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
