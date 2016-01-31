'use strict';

angular.module('app')
  .directive('settings', function() {
    return {
      scope: {},
      templateUrl: 'app/user/settings.html',
      replace: true,
      controllerAs: 'ctrl',
      controller: function ($scope, User, Auth, Message) {
        var ctrl = this;
        ctrl.errors = {};

        ctrl.changePassword = function(form) {
          ctrl.submitted = true;
          if(form.$valid) {
            Auth.changePassword(ctrl.user.oldPassword, ctrl.user.newPassword )
              .then( function() {
                //ctrl.message = 'Password successfully changed.';
                Message.info('Password successfully changed');
              })
              .catch( function() {
                form.password.$setValidity('mongoose', false);
                Message.error('Incorrect password');
                //ctrl.errors.other = 'Incorrect password';
                //ctrl.message = '';
              });
          }
        };
      }
    }
  });
