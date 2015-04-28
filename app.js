var telldus = require('./telldus');

function showDevices() {
	telldus.doCall('devices/list', {supportedMethods: 1})
		.then(function (response) {
			var devices = response.device;

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
			});

		})
		.fail(function (error) {
			console.log(error);
		});
}

function showSensors() {
	telldus.doCall('sensors/list', {supportedMethods: 1})
		.then(function (response) {
			var sensors = response.sensor;

			console.log('--- Sensors ---');
			sensors.forEach(function (sensor) {
				//console.log('%s : %s', sensor.name, sensor.id);
				getSensor(sensor.id);
			});
		})
		.fail(function (error) {
			console.log(error);
		});
}

function getSensor(id) {
	telldus.doCall('sensor/info', {supportedMethods: 1, id:id})
		.then(function (response) {
			var sensor = response;
			console.log('%s -> %s : %s', sensor.name, sensor.data[0].name, sensor.data[0].value);
		})
		.fail(function (error) {
			console.log(error);
		});
}


showDevices();
showSensors();
