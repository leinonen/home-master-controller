(function () {

  var module = angular.module('device');

  module.controller('DeviceListCtrl', function (MasterApi, DeviceHelper) {
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

    ctrl.getSupportedMethods = function (device) {
      return DeviceHelper.getSupportedMethods(device);
    };

    ctrl.getStates = function (device) {
      return DeviceHelper.getStates(device);
    };


    ctrl.toggleDevice = function (index, device) {
      if (ctrl.isOn(device)) {
        ctrl.turnOff(index, device);
      } else {
        ctrl.turnOn(index, device);
      }
    };


    ctrl.isOff = function (device) {
      return DeviceHelper.isOff(device);
    };

    ctrl.isOn = function (device) {
      return DeviceHelper.isOn(device);
    };

    ctrl.isMotorized = function (device) {
      return DeviceHelper.isMotorized(device);
    };

    ctrl.getButtonText = function (device) {
      if (DeviceHelper.isMotorized(device)) {
        return DeviceHelper.isOn(device) ? 'Bring Down' : 'Bring Up';
      } else {
        return DeviceHelper.isOn(device) ? 'Turn Off' : 'Turn On';
      }
    };

    ctrl.turnOn = function (index, device) {
      if (DeviceHelper.isMotorized(device)) {
        MasterApi.goUp(device.id).then(function (status) {
          if (status === 'success') {
            console.log('device.turnOn successful');
            updateDevice(index, device.id);
          } else {
            console.log(status);
          }
        });
      } else {
        MasterApi.turnOn(device.id).then(function (status) {
          if (status === 'success') {
            console.log('device. turned on successfully!');
            updateDevice(index, device.id);
          } else {
            console.log(status);
          }
        });
      }

    };

    ctrl.turnOff = function (index, device) {
      if (DeviceHelper.isMotorized(device)) {
        MasterApi.goDown(device.id).then(function (status) {
          if (status === 'success') {
            console.log('device turned DOWN successfully!');
            updateDevice(index, device.id);
          } else {
            console.log(status);
          }
        });
      } else {
        MasterApi.turnOff(device.id).then(function (status) {
          if (status === 'success') {
            console.log('device turned off successfully!');
            updateDevice(index, device.id);
          } else {
            console.log(status);
          }
        });
      }

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
