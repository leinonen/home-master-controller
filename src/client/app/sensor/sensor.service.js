'use strict';

(function() {

  angular.module('app')
    .service('Sensor', function($rootScope, $timeout, MasterApi, ErrorHandler) {
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

      $rootScope.$on('sensor-change', function(event, sensor) {
        $timeout(function() {
          service.sync(sensor);
        }, 10);
      });

      service.sync = function(updatedSensor) {
        model.sensors
          .filter(function(sensor) {
            return sensor.id === updatedSensor.id && sensor.type === updatedSensor.type;
          })
          .forEach(function(sensor) {
            sensor.data = updatedSensor.data;
          });
      };

      service.update = function(data) {
        model.sensors = data;
        console.log('sensors updated');
      };

    });

})();
