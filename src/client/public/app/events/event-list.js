(function(){

  angular.module('app')
  .directive('eventList', function() {
    return {
      scope: {},
      templateUrl: 'app/events/event-list.html',
      replace: true,
      controllerAs: 'ctrl',
      bindToController: true,
      controller: function(MasterApi) {
        var ctrl = this;
        ctrl.events = [];

        MasterApi.getEvents().then(function(events) {
          ctrl.events = events;
        });
      }
    };
  });

})();