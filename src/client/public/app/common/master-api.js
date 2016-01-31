(function () {

  angular.module('app').service('MasterApi', function ($http) {

    function unwrap(response) {
      return response.data;
    }

    // Sensors
    this.getSensors = function () {
      return $http.get('/api/hmc/sensors').then(unwrap);
    };

    this.getSensor = function (id) {
      return $http.get('/api/hmc/sensors/' + id).then(unwrap);
    };

    // Devices
    this.getDevices = function () {
      return $http.get('/api/hmc/devices').then(unwrap);
    };

    this.getDevice = function (id, type) {
      return $http.get('/api/hmc/device/' + id + '?type=' + type).then(unwrap);
    };

    // Groups
    this.getGroups = function () {
      return $http.get('/api/hmc/groups').then(unwrap);
    };

    this.getGroup = function (id, type) {
      return $http.get('/api/hmc/group/' + id + '?type=' + type).then(unwrap);
    };

    this.createGroup = function (group) {
      return $http.post('/api/hmc/groups', group).then(unwrap);
    };

    this.updateGroup = function (id, group) {
      return $http.post('/api/hmc/group/' + id, group).then(unwrap);
    };

    this.deleteGroup = function (id) {
      return $http.delete('/api/hmc/group/' + id).then(unwrap);
    };

    this.getGroupDevices = function (id, type) {
      return $http.get('/api/hmc/group/' + id + '/devices?type=' + type).then(unwrap);
    };

    this.getGroupState = function (id) {
      return $http.get('/api/hmc/groupState/' + id).then(unwrap);
    };

    // Control
    this.control = function (id, params) {
      return $http.post('/api/hmc/control/' + id, params).then(unwrap);
    };

  });

})();
