(function(){

  angular.module('app')
    .component('createEvent', {
        bindings: {},
        templateUrl: 'app/events/create-event.html',
        controller: function($state, $stateParams, $rootScope, MasterApi, Sensor) {

          var ctrl = this;

          ctrl.isEditMode = function() {
            return $stateParams.id !== undefined;
          };

          ctrl.event = {};

          if (ctrl.isEditMode()) {
            MasterApi.getEvent($stateParams.id).then(function(event) {
              console.log('got event data', event);
              ctrl.event = event;
            });
          }

          ctrl.sensors = Sensor.getSensors().map(function(sensor) {
            return {
              name: sensor.name,
              type: sensor.type,
              value: sensor
            };
          });

          ctrl.sensorActions = [
            {name: 'Sensor ON',  value: 'sensor-on' },
            {name: 'Sensor OFF', value: 'sensor-off'}
          ];

          ctrl.deviceActions = [
            {name: 'Turn ON',  value: 'device-on' },
            {name: 'Turn OFF', value: 'device-off'}
          ];

          ctrl.sensorAction = ctrl.sensorActions[0].value;
          ctrl.deviceAction = ctrl.deviceActions[0].value;

          ctrl.devices = [];
          MasterApi.getDevices().then(function(devices) {
            ctrl.devices = devices;
          });

          ctrl.selectedSensor = null;
          ctrl.selectedDevices = [];

          ctrl.validate = function() {
            return true; //  /* ctrl.selectedSensor !== undefined &&*/ ctrl.selectedDevices.length > 0;
          };

          ctrl.submitForm = function() {
            if (ctrl.validate()) {
              var message = {
                _id:    ctrl.event._id,
                name:   ctrl.event.name,
                sensor: ctrl.event.selectedSensor,
                sensorAction: ctrl.event.sensorAction,
                devices:      ctrl.event.selectedDevices,
                deviceAction: ctrl.event.deviceAction
              };
              if (ctrl.isEditMode()) {
                MasterApi.updateEvent(message);
              } else {
                MasterApi.createEvent(message);
              }
              console.log(message);

              $state.go('root.events');
            } else {
              console.log('error. henkes fel')
            }
          };


          ctrl.deleteEvent = function() {
            MasterApi.deleteEvent(ctrl.event);
            $state.go('root.events');
          };

          function isValidDevice(type) {
            return ['telldus-device', 'hue-device', 'zwave-switch-binary'].indexOf(type) !== -1;
          }

          function isValidSensor(type) {
            return type === 'zwave-sensor-binary';
          }

        }
    });

})();