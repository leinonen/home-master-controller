(function() {

  angular.module('app')
    .service('Sensor', function(MasterApi, ErrorHandler) {
      var service = this;
      var model = {};

      service.getSensors = function() {
        return MasterApi.getSensors().then(function(sensors) {
          model.sensors = sensors;
        }).catch(ErrorHandler.handle);
      };

      service.update = function(data) {
        model.sensors = data;
        console.log('sensors updated');
      };


    });

})();
