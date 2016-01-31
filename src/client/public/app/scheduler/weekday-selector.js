(function() {

  angular.module('app').directive('weekdaySelector', function() {
    return {
      scope: {
        weekdays: '='
      },
      replace: true,
      templateUrl: 'app/scheduler/weekday-selector.html',
      controllerAs: 'ctrl',
      bindToController: true,
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
    }
  })

})();