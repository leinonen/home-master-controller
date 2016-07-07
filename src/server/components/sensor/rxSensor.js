'use strict';

const
  Rx = require('rx'),
  bus = require('../../util/bus');

function RxSensor() {
  let sensorList = [];

  return {
    start: () => {

      let timerStream = Rx.Observable.interval(1000);

      let sensorChangeStream = Rx.Observable.fromEvent(bus, 'sensor_change');
/*
      let sensorValue = () => ZWave.sensor('ZWayVDev_zway_9-0-48-1')
        .then(ZWave.transformSensor)
        .then(sensor => sensor.data[0].value.trim());

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
*/
    }
  };
}

module.exports = function() {
  return new RxSensor();
};


