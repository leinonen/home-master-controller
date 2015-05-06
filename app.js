var telldus = require('./telldus');

function showDevices() {
  telldus
    .listDevices()
    .then(function (devices) {

      var groups = devices.filter(function (d) {
        return d.type === 'group';
      });

      var hardware = devices.filter(function (d) {
        return d.type === 'device';
      });

      console.log('--- Groups ---');
      groups.forEach(function (group) {
        console.log(group.name);
      });

      console.log('--- Hardware ---');
      hardware.forEach(function (device) {
        console.log(device.name);
      });

    })
    .fail(console.error);
}

function showSensors() {
  telldus
    .listSensors()
    .then(function (sensors) {
      console.log('--- Sensors ---');
      sensors.forEach(function (sensor) {
        //console.log('%s : %s', sensor.name, sensor.id);
        getSensor(sensor.id);
      });
    })
    .fail(console.error);
}

function getSensor(id) {
  telldus
    .getSensor(id)
    .then(function (response) {
      var sensor = response;
      console.log('%s -> %s : %s', sensor.name, sensor.data[0].name, sensor.data[0].value);
    })
    .fail(console.error);
}


showDevices();
showSensors();
