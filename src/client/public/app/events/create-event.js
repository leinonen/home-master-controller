(function(){

  angular.module('app')
    .directive('createEvent', function() {
      return {
        scope: {},
        templateUrl: 'app/events/create-event.html',
        replace: true,
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($rootScope, MasterApi) {
          var ctrl = this;
          ctrl.form = {
            eventName: ''
          };
          ctrl.sensors = [];
          ctrl.devices = [];
          ctrl.selectedSensor = {
            id: 'test'
          };
          ctrl.selectedDevices = [];

          ctrl.validate = function() {
            return /* ctrl.selectedSensor !== undefined &&*/ ctrl.selectedDevices.length > 0;
          };

          ctrl.submitForm = function() {
            console.log('selectedSensor:', ctrl.selectedSensor);
            console.log('selectedDevices:', ctrl.selectedDevices);
            if (ctrl.validate()) {
              console.log('Success');
              var message = {
                name: ctrl.form.eventName,
                sensor: ctrl.selectedSensor.id,
                action: String
              };
              MasterApi.createEvent(message);
            } else {
              console.log('error. henkes fel')
            }
          };

          MasterApi.getSensors().then(function(sensors) {
            ctrl.sensors = sensors.filter(function(item) {
              return item.type === 'zwave-sensor-binary';
            });
          });

          MasterApi.getDevices().then(function(devices) {
            ctrl.devices = devices;
          });

          function isValidDevice(type) {
            return ['telldus-device', 'hue-device', 'zwave-switch-binary'].indexOf(type) !== -1;
          }

          function isValidSensor(type) {
            return type === 'zwave-sensor-binary';
          }

          $rootScope.$on('item.selected', function(event, item) {
            if(isValidDevice(item.type)) {
              ctrl.selectedDevices.push(item);
            } else if (isValidSensor(item.type)) {
              ctrl.selectedSensor = item;
              console.log(ctrl.selectedSensor);
            }
          });

        }
      };
    });

})();