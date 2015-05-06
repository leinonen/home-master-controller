var telldus = require('./telldus');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongo.url, config.mongo.opts);

var Sensor = mongoose.model('Sensor', mongoose.Schema({
  name: String,
  readings: [{
    date: Date,
    data: String,
    value: Number
  }]
}));

function createSensorData(sensor){
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

telldus.doCall(
  'sensors/list',
  {supportedMethods: 1}
).then(function (response) {
    response.sensor.forEach(function (currentSensor) {
      //console.log('%s : %s', sensor.name, sensor.id);
      telldus.doCall(
        'sensor/info',
        {supportedMethods: 1, id: currentSensor.id}
      ).then(function (sensor) {
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
        }).fail(function (error) {
          console.log(error);
        });
    });

  }).fail(function (error) {
    console.log(error);
  });
