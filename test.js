var hue = require('./server/hue');

/*
 hue.getGroups().then(function(groups){
 console.log(groups);
 });

 */

hue.setLightState(1, {on: false}).then(function(response){
  console.log(response);
});
