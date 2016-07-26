'use strict';

(function() {

  angular.module('app')
    .component('schedulerEdit', {
      templateUrl: 'app/scheduler/scheduler-edit.html',
      controller: function($rootScope, $state, $stateParams,
                           SchedulerService, Message, ErrorHandler, MasterApi, Weekdays) {
        var ctrl = this;
        ctrl.actions = [
          {name: 'Turn device On', value: 'on'},
          {name: 'Turn device Off', value: 'off'}
        ];
        ctrl.devices = [];

        ctrl.schedule = {
          name: '',
          items: [],
          action: '',
          active: true,
          time: '',
          sunrise: false,
          sunset: false,
          random: 0,
          weekdays: []
        };
        ctrl.weekdays = {};
        ctrl.sun = {};

        ctrl.isEditMode = function() {
          return ctrl.schedule._id !== undefined;
        };

        MasterApi.getDevices().then(function(devices) {
          ctrl.devices = devices;
        });

        if ($stateParams.id) {
          SchedulerService.getSchedule($stateParams.id).then(function(schedule) {

            console.log(schedule);
            ctrl.schedule = schedule;
            ctrl.schedule.weekdays.forEach(function(day) {
              ctrl.weekdays[day] = true;
            });
            ctrl.schedule.items.forEach(function(item) {
              MasterApi.getDevice(item.id, item.type).then(function(/*device*/) {
                ctrl.devices.forEach(function(device) {
                  if (device.id === item.id && device.type === item.type) {
                    device.selected = true;
                  }
                });
              });
            });

          }).catch(ErrorHandler.handle);
        }

        SchedulerService.getSun().then(function(sun) {
          ctrl.sun = sun;
        });

        ctrl.validateForm = function() {
          // TODO: Validate the form
          return true;
        };

        ctrl.selectWorkdays = function() {
          ctrl.weekdays = Weekdays.getWorkdays();
        };

        ctrl.selectWeekend = function() {
          ctrl.weekdays = Weekdays.getWeekend();
        };

        ctrl.selectFullWeek = function() {
          ctrl.weekdays = Weekdays.getFullWeek();
        };

        ctrl.isSunriseOrSunset = function() {
          return ctrl.schedule.sunset || ctrl.schedule.sunrise;
        };

        ctrl.deleteSchedule = function(id) {
          SchedulerService.deleteSchedule(id).then(function() {
            Message.success('Schedule deleted');
            $state.go('root.scheduler');
          }).catch(ErrorHandler.handle);
        };

        ctrl.updateInformation = function() {
          var wd = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          ctrl.schedule.weekdays = wd.filter(function(w) {
            return ctrl.weekdays[w];
          });

          ctrl.schedule.items = ctrl.devices
            .filter(function(item) {
              return item.selected === true;
            })
            .map(function(item) {
              return {
                id: item.id,
                type: item.type
              };
            });
        };

        ctrl.createSchedule = function() {
          if (!ctrl.validateForm()) {
            Message.warning('Form is not valid');
            return;
          }

          ctrl.updateInformation();

          SchedulerService.createSchedule(ctrl.schedule).then(function(/*schedule*/) {
            ctrl.schedule = {};
            Message.success('Successfully created schedule');
            $state.go('root.scheduler');
          }).catch(ErrorHandler.handle);
        };

        ctrl.updateSchedule = function() {
          if (!ctrl.validateForm()) {
            Message.warning('Form is not valid');
            return;
          }

          ctrl.updateInformation();

          SchedulerService.updateSchedule(ctrl.schedule._id, ctrl.schedule).then(function(/*schedule*/) {
            ctrl.schedule = {};
            Message.success('Successfully updated schedule');
            $state.go('root.scheduler');
          }).catch(ErrorHandler.handle);
        };

        ctrl.saveButtonClick = function() {
          if (ctrl.isEditMode()) {
            ctrl.updateSchedule();
          } else {
            ctrl.createSchedule();
          }
        };

      }
    });

})();
