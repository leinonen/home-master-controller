var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose-q')();
var fs = require('fs');
var homedir = require('homedir');
var User = require('./models/user');

var controller = require('./server/controller');
var ScheduleService = require('./models/schedule');
var Scheduler = require('./server/scheduler');
var scheduler = new Scheduler(ScheduleService);
var conf = path.join(homedir(), '/.hmc.conf');

if (!fs.existsSync(conf)) {
  console.error('Configuration file missing! Create .hmc.conf in your home directory.');
  process.exit(-1);
}

var config = JSON.parse(fs.readFileSync(conf, 'utf-8'));

mongoose.connect(config.mongo.url, config.mongo.opts);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

User.find({}).remove(function() {
  User.create({
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }, function() {
      console.log('finished populating users');
    }
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(methodOverride());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/client/public')));

app.use(passport.initialize());

// Persist sessions with mongoStore
// We need to enable sessions for passport twitter because its an oauth 1.0 strategy
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    db: 'yoapp'
  })
}));

app.use('/auth', require('./server/auth'));
app.use('/api/users', require('./server/api/user'));

app.get('/api/configuration', controller.readConfiguration);
app.post('/api/configuration', controller.saveConfiguration);

app.get('/api/sensors', controller.sensors);
app.get('/api/sensors/:id', controller.sensor);

app.get('/api/devices', controller.devices);
app.get('/api/device/:id', controller.device);

app.get('/api/groups', controller.groups);
app.post('/api/groups', controller.createGroup);
app.get('/api/groupState/:id', controller.groupState);

app.get('/api/group/:id', controller.group);
app.post('/api/group/:id', controller.updateGroup);
app.delete('/api/group/:id', controller.deleteGroup);
app.get('/api/group/:id/devices', controller.groupDevices);

app.post('/api/control/:id', controller.control);

// Scheduler
app.get('/api/schedules', controller.schedules);
app.post('/api/schedules', controller.createSchedule);
app.get('/api/schedules/:id', controller.schedule);
app.put('/api/schedules/:id', controller.updateSchedule);
app.delete('/api/schedules/:id', controller.deleteSchedule);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.sendStatus(err.status || 500);
});

app.listen(config.port);
console.log('Home Master Controller is running on port %d', config.port);

scheduler.start();

process.on('uncaughtException', function (error) {
  console.log(error.stack);
});
