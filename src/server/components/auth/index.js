'use strict';

const
  passport = require('passport'),
  User = require('../user/user.model.js');

// Passport Configuration
require('./local/passport').setup(User);
//require('./facebook/passport').setup(User, config);
//require('./google/passport').setup(User, config);
//require('./twitter/passport').setup(User, config);

module.exports = require('express').Router()
  .use('/local', require('./local'));

//.use('/facebook', require('./facebook'));
//.use('/twitter', require('./twitter'));
//.use('/google', require('./google'));
