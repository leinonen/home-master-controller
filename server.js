var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose-q')();
var User = require('./server/api/user/user.model.js');
var auth = require('./server/auth/auth.service');
var Logger = require('./server/util/logger');
var ScheduleService = require('./server/api/scheduler/schedule.model.js');
var Scheduler = require('./server/api/scheduler/scheduler');
var scheduler = new Scheduler(ScheduleService);
var hmcConfig = require('./server/hmc.conf');

mongoose.connect(hmcConfig.mongo.url, hmcConfig.mongo.opts);
mongoose.connection.on('error', function(err) {
    Logger.error('MongoDB connection error: ' + err);
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
      Logger.info('HMC: Finished populating users');
    }
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(passport.initialize());

// Persist sessions with mongoStore
// We need to enable sessions for passport twitter because its an oauth 1.0 strategy
app.use(session({
  secret: hmcConfig.secret,
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    db: 'hmc'
  })
}));

app.use('/auth', require('./server/auth'));
app.use('/api/users', require('./server/api/user'));
app.use('/api/hmc', require('./server/api/hmc'));
app.use('/api/scheduler', require('./server/api/scheduler'));
app.use('/api/config', require('./server/api/configuration'));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.sendStatus(err.status || 500);
});

app.listen(hmcConfig.port);
Logger.info('HMC: System running on port ' + hmcConfig.port);

scheduler.start();
