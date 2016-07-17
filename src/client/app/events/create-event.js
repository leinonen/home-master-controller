'use strict';

(function() {

  angular.module('app')
    .component('createEvent', {
      bindings: {},
      templateUrl: 'app/events/create-event.html',
      controller: function($state, $stateParams, $rootScope, MasterApi, Sensor, Message) {

        var ctrl = this;

        ctrl.isEditMode = function() {
          return $stateParams.id !== undefined;
        };

        var isSelectedSensor = function(sensor) {
          return sensor.type === ctrl.event.sensor.type;
        };

        ctrl.sensorActions = [
          {name: 'Sensor ON', value: 'sensor-on'},
          {name: 'Sensor OFF', value: 'sensor-off'}
        ];

        ctrl.deviceActions = [
          {name: 'Turn ON', value: 'device-on'},
          {name: 'Turn OFF', value: 'device-off'}
        ];

        ctrl.sensorAction = ctrl.sensorActions[0].value;
        ctrl.deviceAction = ctrl.deviceActions[0].value;

        ctrl.event = {};
        ctrl.sensors = [];
        ctrl.devices = [];

        var updateModel = function() {

          var getSensors = function() {
            return Sensor.getAsync().then(function(sensors) {
              return sensors.map(function(sensor) {
                return {
                  name: sensor.name,
                  type: sensor.type,
                  value: sensor
                };
              });
            }).then(function(sensors) {
              ctrl.sensors = sensors;
              return ctrl.sensors;
            });
          };

          var updateEvent = function(event) {
            ctrl.event = event;
            console.log('EVENT', ctrl.event);
            // Update selected sensor
            ctrl.sensors
              .filter(isSelectedSensor)
              .forEach(function(sensor) {
                ctrl.event.sensor = sensor.value;
              });

            // Update selected devices
            ctrl.devices.forEach(function(device) {
              ctrl.event.devices.forEach(function(item) {
                if (item.id === device.id && item.type === device.type) {
                  device.selected = true;
                }
              });
            });
          };

          if (ctrl.isEditMode()) {
            getSensors()
              .then(MasterApi.getDevices)
              .then(function(devices) { ctrl.devices = devices; })
              .then(function() {
                return MasterApi
                  .getEvent($stateParams.id)
                  .then(updateEvent);
              });
          } else {
            getSensors()
              .then(MasterApi.getDevices)
              .then(function(devices) { ctrl.devices = devices; });
          }
        };

        updateModel();

        ctrl.validate = function() {
          return ctrl.event.sensor !== undefined &&
            ctrl.devices.filter(isDeviceSelected).length > 0;
        };

        function isDeviceSelected(device) {
          return device.selected === true;
        }

        ctrl.submitForm = function() {
          if (ctrl.validate()) {

            var message = {
              _id: ctrl.event._id,
              name: ctrl.event.name,
              sensor: ctrl.event.sensor,
              sensorAction: ctrl.event.sensorAction,
              devices: ctrl.devices.filter(isDeviceSelected),
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
            Message.danger('Form validation failed');
          }
        };


        ctrl.deleteEvent = function() {
          MasterApi.deleteEvent(ctrl.event);
          $state.go('root.events');
        };

/*        function isValidDevice(type) {
          return ['telldus-device', 'hue-device', 'zwave-switch-binary'].indexOf(type) !== -1;
        }

        function isValidSensor(type) {
          return type === 'zwave-sensor-binary';
        }
*/
      }
    });

})();