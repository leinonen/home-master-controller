'use strict';

const
  passport = require('passport'),
  auth = require('../auth.service');

module.exports = require('express').Router()

  .post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      var error = err || info;
      if (error) {
        return res.status(401).json(error);
      }
      if (!user) {
        return res.status(404).json({message: 'Something went wrong, please try again.'});
      }

      res.json({
        token: auth.signToken(user._id, user.role)
      });
    })(req, res, next);

  });
