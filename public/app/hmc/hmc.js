(function () {

  var module = angular.module('hmc', []);

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

    this.turnOn = function (id) {
      return $http.get('/api/turnOn/' + id).then(unwrap).then(function (status) {
        return status.status;
      });
    };

    this.turnOff = function (id) {
      return $http.get('/api/turnOff/' + id).then(unwrap).then(function (status) {
        return status.status;
      });
    };

    this.goUp = function (id) {
      return $http.get('/api/up/' + id).then(unwrap).then(function (status) {
        return status.status;
      });
    };

    this.goDown = function (id) {
      return $http.get('/api/down/' + id).then(unwrap).then(function (status) {
        return status.status;
      });
    };

    // Philips HUE stuff

    this.getHueGroups = function () {
      return $http.get('/api/hue/groups').then(unwrap);
    };

    this.getHueLights = function () {
      return $http.get('/api/hue/lights').then(unwrap);
    };

    this.hueOn = function (id) {
      var data = {on: true};
      return $http.put('/api/hue/lights/' + id + '/state', data).then(unwrap);
    };

    this.hueOff = function (id) {
      var data = {on: false};
      return $http.put('/api/hue/lights/' + id + '/state', data).then(unwrap);
    };

    this.hueGroupOn = function (id) {
      var data = {on: true};
      return $http.put('/api/hue/groups/' + id + '/action', data).then(unwrap);
    };

    this.hueGroupOff = function (id) {
      var data = {on: false};
      return $http.put('/api/hue/groups/' + id + '/action', data).then(unwrap);
    };

    this.hueLightBrightness = function (id, bri) {
      var data = {bri: bri};
      return $http.put('/api/hue/lights/' + id + '/state', data).then(unwrap);
    };

    this.hueGroupBrightness = function (id, bri) {
      var data = {bri: bri};
      return $http.put('/api/hue/groups/' + id + '/action', data).then(unwrap);
    };
  });

})();
