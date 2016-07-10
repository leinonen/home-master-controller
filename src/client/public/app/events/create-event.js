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

          ctrl.form = {
            eventName: ''
          };

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
                name: ctrl.form.eventName,
                sensor: ctrl.selectedSensor,
                sensorAction: ctrl.sensorAction,
                devices: ctrl.selectedDevices,
                deviceAction: ctrl.deviceAction
              };
              if (ctrl.isEditMode()) {
                MasterApi.updateEvent(message);
              } else {
                MasterApi.createEvent(message);
              }

              $state.go('root.events');
            } else {
              console.log('error. henkes fel')
            }
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