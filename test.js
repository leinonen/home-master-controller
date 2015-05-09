var hue = require('./server/hue');
var telldus = require('./server/telldus');

/*
 hue.getGroups().then(function(groups){
 console.log(groups);
 });

 */

/*
hue.setLightState(1, {on: false}).then(function(response){
  console.log(response);
});
*/


telldus.listDevices().then(function(groups){
  console.log(groups);
});
