(function () {

  angular.module('app').service('MasterApi', function ($http) {

    var SENSOR_API = '/api/';
    var DEVICE_API = '/api/';
    var GROUPS_API = '/api/';
    var EVENTS_API = '/api/';

    function unwrap(response) {
      return response.data;
    }

    // Sensors
    this.getSensors = function () {
      return $http.get(SENSOR_API + 'sensors').then(unwrap);
    };

    this.getSensor = function (id) {
      return $http.get(SENSOR_API + 'sensors/' + id).then(unwrap);
    };

    // Devices
    this.getDevices = function () {
      return $http.get(DEVICE_API + 'devices').then(function(response) {
        return response.data.devices;
      });
    };

    this.getDevice = function (id, type) {
      return $http.get(DEVICE_API + 'devices/' + type + '/' + id).then(function(response) {
        return response.data.device;
      });
    };

    // Control
    this.control = function (id, params) {
      return $http.post(DEVICE_API + 'control/' + id, params).then(unwrap);
    };

    // Groups
    this.getGroups = function () {
      return $http.get(GROUPS_API + 'groups').then(function(response) {
        return response.data.groups;
      });
    };

    this.getGroup = function (id, type) {
      return $http.get(GROUPS_API + 'groups/' + type + '/' + id).then(function(response) {
        return response.data.group;
      });
    };

    this.getGroupDevices = function (id) {
      return $http.get(GROUPS_API + 'groups/' + id + '/devices').then(unwrap);
    };

    this.getGroupState = function (id, type) {
      return $http.get(GROUPS_API + 'groups/' + type + '/' + id + '/state').then(unwrap);
    };

    this.createGroup = function (group) {
      return $http.post(GROUPS_API + 'groups', group).then(unwrap);
    };

    this.updateGroup = function (id, group) {
      return $http.post(GROUPS_API + 'groups/generic-group/' + id, group).then(unwrap);
    };

    this.deleteGroup = function (id) {
      return $http.delete(GROUPS_API + 'groups/' + id).then(unwrap);
    };

    this.getEvents = function() {
      return $http.get(EVENTS_API + 'events').then(unwrap);
    };

    this.createEvent = function(event) {
      return $http.post(EVENTS_API + 'events', event).then(unwrap);
    };

  });

})();
