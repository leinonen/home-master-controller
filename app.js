var telldus = require('./telldus');

telldus.doCall('devices/list', { supportedMethods: 1 })
.then(function(response){
  console.log(response);
})
.fail(function(error){
  console.log(error);
});