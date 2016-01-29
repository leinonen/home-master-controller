(function () {

  angular.module('app').controller('SchedulerListCtrl', function (SchedulerService, MasterApi) {
    var ctrl = this;
    ctrl.schedules = [];

    SchedulerService.getSchedules().then(function (schedules) {
      ctrl.schedules = schedules;
      ctrl.schedules
        .filter(function (s) {
          return s.items.length > 0;
        })
        .forEach(function (s) {

          if (s.sunset) {
            s.time = 'Sunset';
          } else if (s.sunrise) {
            s.time = 'Sunrise';
          }

          s.items
            .forEach(function (item) {
              MasterApi
                .getDevice(item.id, item.type)
                .then(function (device) {
                  console.log(s.name + ' : ' + device.name);
                  for (var x = 0; x < ctrl.schedules.length; x++) {
                    if (ctrl.schedules[x]._id === s._id) {
                      ctrl.schedules[x].devices = ctrl.schedules[x].devices || [];
                      ctrl.schedules[x].devices.push(device);
                    }
                  }
                });
            });

        });

    });

    ctrl.checkDay = function (day, arr) {
      return arr.filter(function (a) {
          return a === day;
        }).length > 0;
    };

    ctrl.getIcon = function (day, arr) {
      return ctrl.checkDay(day, arr) ? 'text-success glyphicon glyphicon-ok' : '';
    };

    ctrl.getDayClass = function (day, arr) {
      return ctrl.checkDay(day, arr) ? 'text-success' : '';
    };
  });


  angular.module('app').directive('schedulerList', function () {
    return {
      replace: true,
      templateUrl: 'app/scheduler-list.html',
      controller: 'SchedulerListCtrl',
      controllerAs: 'ctrl'
    }
  })

})();