'use strict';

// Sensor test using RxJS Observables. Fun stuff!

const
  Rx = require('rx'),
  bus = require('./server/util/bus'),
  Hue = require('./server/lib/hue/hue'),
  mongoose = require('mongoose-q')(),
  ZWave = require('./server/lib/zwave/zwave'),
  nconf = require('nconf');

nconf.argv().env().file({ file: 'config.json' });

console.log('Connecting to database: %s', nconf.get('MONGO_URL'));
mongoose.connect(nconf.get('MONGO_URL'), {server: {socketOptions: { keepAlive: 1 }}});

const setLightState = (state) => ['7', '8', '9'].forEach(id => Hue.setLightState(id, {on: state}));

let sensorValue = () => ZWave.sensor('ZWayVDev_zway_9-0-48-1')
  .then(ZWave.transformSensor)
  .then(sensor => sensor.data[0].value.trim());

let timerStream = Rx.Observable.timer(1000, 1000);

let sensorValueStream = timerStream
  .flatMap(x => Rx.Observable.fromPromise(sensorValue()))
  .distinctUntilChanged();

let sensorChangeStream = Rx.Observable.fromEvent(bus, 'sensor_change');

sensorValueStream.subscribe(
  value => bus.emit('sensor_change', value),
  error => console.log(error)
);

sensorChangeStream.subscribe(
  value => {
    console.log('Sensor changed: ', value);
    setLightState(value === 'on');
  },
  error => console.log(error)
);
