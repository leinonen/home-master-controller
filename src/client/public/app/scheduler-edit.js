(function() {

  angular.module('app')
    .controller('ScheduleCtrl',
    function($rootScope, $state, $stateParams, SchedulerService, Message, MasterApi, Weekdays) {
      var ctrl = this;
      ctrl.devices = [];
      ctrl.selectedDevices = [];
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

      ctrl.isEditMode = function(){
        return ctrl.schedule._id !== undefined;
      };

      MasterApi.getDevices().then(function(devices) {
        ctrl.devices = devices;
      });

      if ($stateParams.id) {
        SchedulerService.getSchedule($stateParams.id).then(function(schedule) {
          ctrl.schedule = schedule;
          ctrl.schedule.weekdays.forEach(function(day) {
            ctrl.weekdays[day] = true;
          });
          ctrl.schedule.items.forEach(function(item) {
            MasterApi.getDevice(item.id, item.type).then(function(device) {
              ctrl.selectedDevices = ctrl.selectedDevices || [];
              ctrl.selectedDevices.push(device);
            });
          })
        });
      }


      SchedulerService.getSun().then(function(sun) {
        ctrl.sun = sun;
      });


      $rootScope.$on('item.selected', function(event, data) {
        console.log(data);
        ctrl.selectedDevices.push(data);
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
        });
      };

      ctrl.createSchedule = function() {
        if (!ctrl.validateForm()) {
          Message.warning('Form is not valid');
          return;
        }

        ctrl.schedule.weekdays = [];
        var wd = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        wd.forEach(function(w) {
          if (ctrl.weekdays[w]) {
            ctrl.schedule.weekdays.push(w);
          }
        });

        ctrl.schedule.items = ctrl.selectedDevices.map(function(item) {
          return {
            id: item.id,
            type: item.type
          };
        });

        console.log(ctrl.schedule);

        SchedulerService.createSchedule(ctrl.schedule).then(function(schedule) {
          ctrl.schedule = {};
          console.log('create successful');
          Message.success('Successfully created schedule');
          $state.go('root.scheduler');
        }).catch(function(err) {
          console.error(err.data);
          Message.danger(err.data);
        });
      };

      ctrl.updateSchedule = function() {
        if (!ctrl.validateForm()) {
          Message.warning('Form is not valid');
          return;
        }

        ctrl.schedule.weekdays = [];
        var wd = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        wd.forEach(function(w) {
          if (ctrl.weekdays[w]) {
            ctrl.schedule.weekdays.push(w);
          }
        });

        ctrl.schedule.items = ctrl.selectedDevices.map(function(item) {
          return {
            id: item.id,
            type: item.type
          };
        });

        console.log(ctrl.schedule);

        SchedulerService.updateSchedule(ctrl.schedule._id, ctrl.schedule).then(function(schedule) {
          ctrl.schedule = {};
          console.log('update successful');
          Message.success('Successfully updated schedule');
          $state.go('root.scheduler');
        }).catch(function(err) {
          console.error(err.data);
          Message.danger(err.data);
        });
      };

      ctrl.saveButtonClick = function(){
        if (ctrl.isEditMode()) {
          ctrl.updateSchedule();
        } else {
          ctrl.createSchedule();
        }
      };

    });


  angular.module('app').directive('schedulerEdit', function() {
    return {
      replace: true,
      templateUrl: 'app/scheduler-edit.html',
      controller: 'ScheduleCtrl',
      controllerAs: 'ctrl'
    }
  })

})();