'use strict';
/*
  Todo: create database model for Events..
  Sensor to watch
  Devices (id + type), to control
  actions to perform (for on and off)
    onAction, offAction
*/
var bus = require('./server/util/bus');
var mongoose = require('mongoose-q')();
var ZWaveAPI = require('./server/components/device/zwave/zwave');
var Hue = require('./server/components/device/hue/hue');
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var mongoOpts = {server: {socketOptions: { keepAlive: 1 }}};
console.log('Connecting to database: %s', nconf.get('MONGO_URL'));

mongoose.connect(nconf.get('MONGO_URL'), mongoOpts);
let previousValue = undefined;

bus.on('sensor_change', (msg) => {
  console.log('Sensor changed. oldValue: "' + msg.oldValue + '", currentValue: "' + msg.currentValue + '"');
  if (msg.currentValue === 'on') {
    console.log('Turn lights on');
    Hue.setLightState('1', {on: true});
  } else if (msg.currentValue === 'off') {
    console.log('Turn lights off');
    Hue.setLightState('1', {on: false});
  }
});

let checkValue = (value) => {
  if (value !== previousValue) {
    bus.emit('sensor_change', { oldValue: previousValue, currentValue: value });
    previousValue = value;
  }
};

let sensorValue = () => ZWaveAPI.sensor('ZWayVDev_zway_9-0-48-1')
  .then(ZWaveAPI.transformSensor)
  .then(sensor => sensor.data[0].value.trim());

let startTimer = () => {
  setInterval(() => {
    sensorValue().then(value => checkValue(value));
  }, 1000);
};

sensorValue().then(value => {
  previousValue = value;
  console.log('Current sensor value: ' + previousValue);
  startTimer();
});
