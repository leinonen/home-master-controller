(function(){

  angular.module('app')
  .component('eventList', {
      bindings: {},
      templateUrl: 'app/events/event-list.html',
      controller: function(MasterApi) {
        var ctrl = this;
        ctrl.events = [];

        MasterApi.getEvents().then(function(events) {
          ctrl.events = events;
        });
      }
  });

})();