(function () {

  var module = angular.module('scheduler', []);

  module.service('SchedulerService', function ($http) {
    var service = this;

    service.getSchedules = function () {
      return $http.get('/api/schedules').then(function (response) {
        return response.data;
      });
    };

    service.getSchedule = function (id) {
      return $http.get('/api/schedules/' + id).then(function (response) {
        return response.data;
      });
    };

    service.updateSchedule = function (id, data) {
      return $http.put('/api/schedules/' + id, data).then(function (response) {
        return response.data;
      });
    };

    service.createSchedule = function (schedule) {
      return $http.post('/api/schedules', schedule).then(function (response) {
        return response.data;
      });
    };

    service.deleteSchedule = function (id) {
      return $http.delete('/api/schedules/' + id).then(function (response) {
        return response.data;
      });
    };

  });

  module.service('Weekdays', function(){
    var service = this;
    service.getWorkdays = function () {
      return {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: false,
        sun: false
      };
    };

    service.getWeekend = function () {
      return {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: true,
        sun: true
      };
    };

    service.getFullWeek = function () {
      return {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true
      };
    };
  })


})();