'use strict';
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

const
  path = require('path'),
  winston = require('winston'),
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session),
  mongoose = require('mongoose-q')(),
  User = require('./server/components/user/user.model.js');

//var ScheduleService = require('./server/components/scheduler/schedule.model.js');
//var Scheduler = require('./server/components/scheduler/scheduler');
//var scheduler = new Scheduler(ScheduleService);

winston.info('Connecting to database: %s', nconf.get('MONGO_URL'));
var mongoOpts = {server: {socketOptions: { keepAlive: 1 }}};
mongoose.connect(nconf.get('MONGO_URL'), mongoOpts);
mongoose.connection.on('error', err => {
    winston.error('MongoDB: Connection error: ' + err);
    process.exit(-1);
  }
);

User.find((err, users) => {
  if (users.length === 0) {
    winston.info('HMC: No users found in db');
    User.create(nconf.get('defaultUser'), () => winston.info('HMC: Created default user'));
  } else {
    winston.info('HMC: Default user found');
  }
});

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}))
  .use(cookieParser())
  .use(passport.initialize())
  .use(express.static(path.join(__dirname, '/client/public')))

  // Persist sessions with mongoStore.
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  .use(session({
    secret: nconf.get('secret'),
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      db: 'hmc'
    })
  }))

  .get('/api', (req, res) => {
    return res.json({
      "api": {
        "description": 'Home Master Controller API'
      },
      "links": [
        {rel: 'self',       href: 'http://localhost:8080/api'},
        {rel: 'devices',    href: 'http://localhost:8080/api/devices'},
        {rel: 'groups',     href: 'http://localhost:8080/api/groups'},
        {rel: 'sensors',    href: 'http://localhost:8080/api/sensors'},
        {rel: 'events',     href: 'http://localhost:8080/api/events'},
        {rel: 'schedules',  href: 'http://localhost:8080/api/schedules'}
      ]
    });
  })

  .use('/auth',          require('./server/components/auth'))
  .use('/api/users',     require('./server/components/user'))
  .use('/api/config',    require('./server/components/configuration'))

  .use('/api/groups',    require('./server/components/groups'))
  .use('/api/devices',   require('./server/components/device'))
  .use('/api/sensors',   require('./server/components/sensor'))

  .use('/api/scheduler', require('./server/components/scheduler'))
  .use('/api/events',    require('./server/components/events'))

  .use((err, req, res, next) => {
    winston.info(err.message);
    res.sendStatus(err.status || 500);
  })

  .listen(nconf.get('PORT'));

winston.info('HMC: HTTP Server running on port %d', nconf.get('PORT'));

//scheduler.start();
