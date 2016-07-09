(function() {

  angular.module('app')
    .service('Sensor', function($rootScope, MasterApi, ErrorHandler) {
      var service = this;
      var model = {};

      service.getSensors = function() {
        return MasterApi.getSensors().then(function(sensors) {
          model.sensors = sensors;
        }).catch(ErrorHandler.handle);
      };


    });

})();
