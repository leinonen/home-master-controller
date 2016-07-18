'use strict';
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

const
  path = require('path'),
  winston = require('winston'),
  compression = require('compression'),
  express = require('express'),
  app = express(),
  http = require('http').Server(app),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session),
  mongoose = require('mongoose-q')(),
  User = require('./server/components/user/user.model.js'),
  Scheduler = require('./server/components/scheduler/rxScheduler'),
  RxSensor = require('./server/components/sensor/rxSensor'),
  Protocol = require('./server/lib/protocol');

const mode = process.env['NODE_ENV'] || 'development'; // or production

let scheduler = new Scheduler();
let rxSensor = new RxSensor();

winston.add(winston.transports.File, { filename: 'server.log' });

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

process.on('SIGINT', function() {
  console.log('PROCESS INTERRUPTED');
  process.exit();
});

process.on('SIGTERM', function() {
  console.log('PROCESS TERMINATED');
  process.exit();
});

process.on('SIGHUP', function() {
  console.log('PROCESS TERMINATED');
  process.exit();
});

Protocol.registerSocketProtocolHandler(http);

app
  .use(compression())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}))
  .use(cookieParser())
  .use(passport.initialize())
  .use(express.static(
    path.join(__dirname, (mode === 'production') ? '/public' : '/client')
  ))

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
      }
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
  });

  http.listen(nconf.get('PORT'));

winston.info('HTTP Server: Running on port %d', nconf.get('PORT'));

scheduler.start();
rxSensor.start();
