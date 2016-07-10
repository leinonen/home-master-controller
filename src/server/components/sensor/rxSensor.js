'use strict';

const
  Rx = require('rx'),
  bus = require('../../util/bus'),
  SensorService = require('./sensor.service'),
  EventsService = require('../events/events.service');

function RxSensor() {

  return {
    start: () => {

      let timerStream = Rx.Observable.interval(5000);

      let sensorChangeStream = Rx.Observable.fromEvent(bus, 'sensor_change');

      let sensorStream = timerStream
        .flatMap(() => Rx.Observable.fromPromise(
          SensorService.getSensors()
        ))
        .flatMap(x => Rx.Observable.fromArray(x))
        .distinctUntilChanged();

      let eventsStream = Rx.Observable
        .fromPromise(EventsService.getEvents())
        .flatMap(x => Rx.Observable.fromArray(x))
        .distinctUntilChanged();


      eventsStream.subscribe(
        event => console.log(event.name),
        error => console.log(error)
      );

      sensorStream.subscribe(
        sensor => bus.emit('sensor_change', sensor),
        error => console.log(error)
      );

      sensorChangeStream.subscribe(
        value => {
          console.log('Sensor changed: ', value.name);
        },
        error => console.log(error)
      );

    }
  };
}

module.exports = function() {
  return new RxSensor();
};


