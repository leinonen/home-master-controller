var telldus = require('./telldus');

telldus.doCall('devices/list', {supportedMethods: 1})
	.then(function (response) {
		var devices = response.json.device;

		var groups = devices.filter(function (d) {
			return d.type === 'group';
		});

		var hardware = devices.filter(function (d) {
			return d.type === 'device';
		});

		console.log('--- Groups ---');
		groups.forEach(function(group){
			console.log(group.name);
		});

		console.log('--- Hardware ---');
		hardware.forEach(function(device){
			console.log(device.name);
		});

	})
	.fail(function (error) {
		console.log(error);
	});