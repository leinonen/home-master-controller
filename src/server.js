'use strict';
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var winston = require('winston');
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
var ScheduleService = require('./server/api/scheduler/schedule.model.js');
var Scheduler = require('./server/api/scheduler/scheduler');
var scheduler = new Scheduler(ScheduleService);

var mongoOpts = {server: {socketOptions: { keepAlive: 1 }}};
winston.info('Connecting to database: ' + nconf.get('MONGO_URL'));

mongoose.connect(nconf.get('MONGO_URL'), mongoOpts);
mongoose.connection.on('error', function(err) {
    winston.error('MongoDB: Connection error: ' + err);
    process.exit(-1);
  }
);

User.find(function(err, users) {
  if (users.length === 0) {
    winston.info('HMC: No users found in db');
    User.create(nconf.get('defaultUser'), function() {
        winston.info('HMC: Created default user');
      }
    );
  } else {
    winston.info('HMC: Default user found');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(passport.initialize());

// Persist sessions with mongoStore
// We need to enable sessions for passport twitter because its an oauth 1.0 strategy
app.use(session({
  secret: nconf.get('secret'),
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
  winston.error(err.message);
  res.sendStatus(err.status || 500);
});

app.listen(nconf.get('PORT'));
winston.info('HMC: HTTP Server running on port ' + nconf.get('PORT'));

scheduler.start();
