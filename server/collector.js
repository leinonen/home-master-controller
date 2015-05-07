var telldus = require('./telldus');
var Sensor = require('./../models/sensor');

function createSensorData(sensor) {
  return {
    date: new Date(),
    data: sensor.data[0].name,
    value: sensor.data[0].value
  };
}

function updateSensor(sens, sensor) {
  sens.readings.push(createSensorData(sensor));
  sens.save();
  console.log('added new sensor data to sensor ' + sensor.name);
}

function createSensor(sensor) {
  var newSensor = new Sensor({
    name: sensor.name,
    readings: [createSensorData(sensor)]
  });
  newSensor.save();
  console.log('saved new sensor to database');
}

function handleSensor(sensor) {
  Sensor.findOne({name: sensor.name})
    .exec(function (err, sens) {
      if (err) {
        console.error(err);
      } else if (sens) {
        updateSensor(sens, sensor);
      } else {
        createSensor(sensor);
      }
    });
}

exports.populateSensors = function() {
  telldus
    .listSensors()
    .then(function (sensors) {

      sensors.forEach(function (sensor) {
        telldus
          .getSensor(sensor.id)
          .then(handleSensor)
          .fail(console.error);
      });

    }).fail(console.error);
};
