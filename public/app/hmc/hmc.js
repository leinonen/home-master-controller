(function () {

  var module = angular.module('hmc', []);

  module.service('MasterApi', function ($http) {

    function unwrap(response){
      return response.data;
    }

    this.getSensors = function () {
      return $http.get('/api/sensors').then(unwrap);
    };

    this.getSensor = function (id) {
      return $http.get('/api/sensors/' + id).then(unwrap);
    };

    this.getDevices = function () {
      return $http.get('/api/devices').then(unwrap);
    };

    this.getDevice = function (id) {
      return $http.get('/api/device/' + id).then(unwrap);
    };

    this.getGroups = function () {
      return $http.get('/api/groups').then(unwrap);
    };

    this.turnOn = function (id) {
      return $http.get('/api/turnOn/' + id).then(unwrap).then(function(status){
        return status.status;
      });
    };

    this.turnOff = function (id) {
      return $http.get('/api/turnOff/' + id).then(unwrap).then(function(status){
        return status.status;
      });
    };

  });

})();
