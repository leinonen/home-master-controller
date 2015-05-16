(function () {

  var module = angular.module('master', []);

  module.service('MasterApi', function ($http) {

    function unwrap(response) {
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

    this.getGroup = function (id, type) {
      return $http.get('/api/group/' + id + '?type=' + type).then(unwrap);
    };

    this.getGroupDevices = function (id, type) {
      return $http.get('/api/group/' + id + '/devices?type=' + type).then(unwrap);
    };

    this.control = function (id, params) {
      return $http.post('/api/control/' + id, params).then(unwrap);
    };

    this.saveGroup = function (group) {
      return $http.post('/api/genericGroups', group).then(unwrap);
    };

  });

})();
