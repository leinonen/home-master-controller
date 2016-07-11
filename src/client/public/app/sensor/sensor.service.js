(function() {

  angular.module('app')
    .service('Sensor', function(MasterApi, ErrorHandler) {
      var service = this;
      var model = {
        sensors: []
      };

      service.getAsync = function() {
        return MasterApi.getSensors().then(function(sensors) {
          model.sensors = sensors;
          return model.sensors;
        }).catch(ErrorHandler.handle);
      };

      service.getAsync();

      service.getSensors = function() {
        return model.sensors;
      };

      service.update = function(data) {
        model.sensors = data;
        console.log('sensors updated');
      };

    });

})();
