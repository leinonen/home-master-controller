'use strict';

angular.module('app')
  .directive('login', function() {
    return {
      scope: {},
      templateUrl: 'app/user/login.html',
      replace: true,
      controllerAs: 'ctrl',
      bindToController: true,
      controller: function (Auth, $location, $window) {
        var ctrl = this;
        ctrl.user = {};
        ctrl.errors = {};
        console.log('login controller');

        ctrl.login = function(form) {
          ctrl.submitted = true;

          if(form.$valid) {
            console.log('form is valid');
            Auth.login({
                email: ctrl.user.email,
                password: ctrl.user.password
              })
              .then( function() {
                console.log('login successful');
                // Logged in, redirect to home
                $location.path('/devices');
              })
              .catch( function(err) {
                console.log(err);
                ctrl.errors.other = err.message;
              });
          }
        };

        ctrl.logout = function() {
          Auth.logout();
          $location.path('/devices');
        }

      }
    }
  });
