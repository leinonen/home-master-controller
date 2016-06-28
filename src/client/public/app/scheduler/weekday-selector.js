(function() {

  angular.module('app')
    .component('weekdaySelector', {
      bindings: {
        weekdays: '='
      },
      templateUrl: 'app/scheduler/weekday-selector.html',
      controller: function(Weekdays) {
        var ctrl = this;

        ctrl.selectWorkdays = function() {
          ctrl.weekdays = Weekdays.getWorkdays();
        };

        ctrl.selectWeekend = function() {
          ctrl.weekdays = Weekdays.getWeekend();
        };

        ctrl.selectFullWeek = function() {
          ctrl.weekdays = Weekdays.getFullWeek();
        };
      }
    })

})();