(function () {

  var module = angular.module('device');

  module.controller('DeviceListCtrl', function ($rootScope, $timeout, MasterApi, Message) {
    var ctrl = this;
    ctrl.devices = [];

    function fetchDevices() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
      }).catch(function (err) {
        Message.danger(err.data.statusCode + ' : ' + err.data.message + ' : ' + err.data.url);
      });
    }

    function fetchDevice(id, type) {
      MasterApi.getDevice(id, type).then(function (device) {
        for(var i=0; i<ctrl.devices.length; i++){
          if (ctrl.devices[i].id === device.id){
            ctrl.devices[i] = device;
            console.log('updated device ' + device.id + ' with index ' + i);
            break;
          }
        }
      }).catch(function (err) {
        Message.danger(err.data.statusCode + ' : ' + err.data.message + ' : ' + err.data.url);
      });
    }

    fetchDevices();

    $rootScope.$on('fetchDevices', fetchDevices);

    $rootScope.$on('fetchDevice', function(event, data){
      fetchDevice(data.id, data.type);
    });

    ctrl.showDevices = function () {
      return ctrl.devices.length > 0;
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
