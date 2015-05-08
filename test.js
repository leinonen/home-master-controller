var telldus = require('./server/telldus');

// Testing the api without any gui

var TELLSTICK_TURNON = 1;
var TELLSTICK_TURNOFF = 2;
var TELLSTICK_BELL = 4;
var TELLSTICK_TOGGLE = 8;
var TELLSTICK_DIM = 16;
var TELLSTICK_LEARN = 32;
var TELLSTICK_EXECUTE = 64;
var TELLSTICK_UP = 128;
var TELLSTICK_DOWN = 256;
var TELLSTICK_STOP = 512;

var TELLSTICK_TYPE_DEVICE = 1;
var TELLSTICK_TYPE_GROUP = 2;
var TELLSTICK_TYPE_SCENE = 3;

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
        //console.log(device);
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


/*

 f ((n & mask) != 0) {
 // bit is set
 } else {
 // bit is not set
 }
 To set a bit:

 n |= mask;
 To clear a bit:

 n &= ~mask;
 To toggle a bit:

 n ^= mask;



 name: "Lavalampa",
 state: 1,
 methods: 3,

 name: "Rullgardin1",
 state: 256,
 methods: 896,


*/

function onoff(val){
  return (val & TELLSTICK_TURNON) !== 0 || (state & TELLSTICK_TURNOFF) !== 0
}

function updown(val){
  return (val & TELLSTICK_DOWN) !== 0 || (state & TELLSTICK_UP) !== 0
}

function down(val){
  return(val & TELLSTICK_DOWN) !== 0;
}

function up(val){
  return(val & TELLSTICK_UP) !== 0;
}

//var value = 384;
var state = 256;
var methods = 896;
console.log('state:' + state);
console.log('methods:' + methods);

if(updown(methods)){
  console.log('vi har en rullgardin!');
}

if (down(state)){
  console.log('rullgardin nere');
}

if (up(state)){
  console.log('rullgardin nere');
}



/*

if (canOnOff(state)){
  console.log('can turn on and off');
}

if (canUpDown(state)){
  console.log('can go up and down');
}


if ((state & TELLSTICK_TURNON) !== 0){
  console.log('can turn on')
}

if ((state & TELLSTICK_TURNOFF) !== 0){
  console.log('can turn off')
}


if ((state & TELLSTICK_DOWN) !== 0){
  console.log('can go down')
}

if ((state & TELLSTICK_UP) !== 0){
  console.log('can go up')
}

if ((state & TELLSTICK_STOP) !== 0){
  console.log('can stop')
}
*/
//showDevices();
/*showSensors();
 */

/*telldus.turnOn(530514).then(function(response){
 console.log(response);
 }); */
//telldus.turnOff(530514);
/*
 telldus.getDevice(530514).then(function(response){
 console.log(response);
 }); */
