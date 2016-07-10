(function() {

  angular.module('app')
    .service('Sensor', function(MasterApi, ErrorHandler) {
      var service = this;
      var model = {
        sensors: []
      };

      MasterApi.getSensors().then(function(sensors) {
        model.sensors = sensors;
      }).catch(ErrorHandler.handle);

      service.getSensors = function() {
        return model.sensors;
      };

      service.update = function(data) {
        model.sensors = data;
        console.log('sensors updated');
      };

    });

})();
