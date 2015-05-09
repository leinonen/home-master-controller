var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./server/config');
var controller = require('./server/controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/api/sensors', controller.sensors);
app.get('/api/sensors/:id', controller.sensor);

app.get('/api/devices', controller.devices);
app.get('/api/device/:id', controller.device);

app.get('/api/groups', controller.groups);
//app.get('/api/groups/:id', controller.group);

app.post('/api/control/:id', controller.control);

app.listen(config.port);
console.log('server listening on port %d', config.port);

