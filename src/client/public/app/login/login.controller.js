'use strict';

angular.module('app').controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};
    console.log('login controller');

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        console.log('form is valid');
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
            console.log('login successful');
          // Logged in, redirect to home
          $location.path('/devices');
        })
        .catch( function(err) {
            console.log(err);
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/devices');
    }

  });
