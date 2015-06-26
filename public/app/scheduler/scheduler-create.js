(function () {

  var module = angular.module('scheduler');

  module.controller('CreateScheduleCtrl', function ($rootScope, SchedulerService, Message, MasterApi, Weekdays) {
    var ctrl = this;
    ctrl.devices = [];
    ctrl.selectedDevices = [];
    ctrl.schedule = {
      name: '',
      items: [],
      action: '',
      active: true,
      time: '',
      random: 0,
      weekdays: []
    };
    ctrl.weekdays = {};

    function fetchDevices() {
      MasterApi.getDevices().then(function (devices) {
        ctrl.devices = devices;
      });
    }

    fetchDevices();

    $rootScope.$on('item.selected', function (event, data) {
      ctrl.selectedDevices.push(data);
    });

    ctrl.validateForm = function () {
      // TODO: Validate the form
      return true;
    };


    ctrl.selectWorkdays = function () {
      ctrl.weekdays = Weekdays.getWorkdays();
    };

    ctrl.selectWeekend = function () {
      ctrl.weekdays = Weekdays.getWeekend();
    };

    ctrl.selectFullWeek = function () {
      ctrl.weekdays = Weekdays.getFullWeek();
    };

    ctrl.createSchedule = function () {
      if (!ctrl.validateForm()) {
        Message.warning('Form is not valid');
        return;
      }

      ctrl.schedule.weekdays = [];
      var wd = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      wd.forEach(function (w) {
        if (ctrl.weekdays[w]) {
          ctrl.schedule.weekdays.push(w);
        }
      });

      ctrl.schedule.items = ctrl.selectedDevices.map(function (item) {
        return {
          id: item.id,
          type: item.type
        };
      });

      console.log(ctrl.schedule);

      SchedulerService.createSchedule(ctrl.schedule).then(function (schedule) {
        ctrl.schedule = {};
        console.log('create successful');
        Message.success('Successfully created schedule');
      }).catch(function (err) {
        console.error(err.data);
        Message.danger(err.data);
      });
    }

  });


  module.directive('schedulerCreate', function () {
    return {
      replace: true,
      templateUrl: 'app/scheduler/scheduler-create.html',
      controller: 'CreateScheduleCtrl',
      controllerAs: 'ctrl'
    }
  })

})();