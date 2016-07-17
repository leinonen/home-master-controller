'use strict';

(function () {

  angular.module('app').service('SchedulerService', function ($http) {
    var service = this;

    function unwrap(response) {
      return response.data;
    }

    service.getSchedules = function () {
      return $http.get('/api/scheduler/schedules').then(unwrap);
    };

    service.getSchedule = function (id) {
      return $http.get('/api/scheduler/schedules/' + id).then(unwrap);
    };

    service.updateSchedule = function (id, data) {
      return $http.put('/api/scheduler/schedules/' + id, data).then(unwrap);
    };

    service.createSchedule = function (schedule) {
      return $http.post('/api/scheduler/schedules', schedule).then(unwrap);
    };

    service.deleteSchedule = function (id) {
      return $http.delete('/api/scheduler/schedules/' + id).then(unwrap);
    };

    service.getSun = function () {
      return $http.get('/api/scheduler/sun').then(unwrap);
    };

  });

  angular.module('app').service('Weekdays', function(){
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
  });

})();