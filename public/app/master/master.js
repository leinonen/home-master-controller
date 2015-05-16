(function () {

  var module = angular.module('master', []);

  module.service('MasterApi', function ($http) {

    function unwrap(response) {
      return response.data;
    }

    // Sensors
    this.getSensors = function () {
      return $http.get('/api/sensors').then(unwrap);
    };

    this.getSensor = function (id) {
      return $http.get('/api/sensors/' + id).then(unwrap);
    };

    // Devices
    this.getDevices = function () {
      return $http.get('/api/devices').then(unwrap);
    };

    this.getDevice = function (id) {
      return $http.get('/api/device/' + id).then(unwrap);
    };

    // Groups
    this.getGroups = function () {
      return $http.get('/api/groups').then(unwrap);
    };

    this.getGroup = function (id, type) {
      return $http.get('/api/group/' + id + '?type=' + type).then(unwrap);
    };

    this.createGroup = function (group) {
      return $http.post('/api/groups', group).then(unwrap);
    };

    this.updateGroup = function (id, group) {
      return $http.post('/api/group/' + id, group).then(unwrap);
    };

    this.deleteGroup = function (id) {
      return $http.delete('/api/group/' + id).then(unwrap);
    };

    this.getGroupDevices = function (id, type) {
      return $http.get('/api/group/' + id + '/devices?type=' + type).then(unwrap);
    };

    // Control
    this.control = function (id, params) {
      return $http.post('/api/control/' + id, params).then(unwrap);
    };



  });

})();
