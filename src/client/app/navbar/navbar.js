'use strict';

(function() {

  angular.module('app')
    .component('navbar', {
      bindings: {},
      templateUrl: 'app/navbar/navbar.html',
      controller: function(Routes, Auth, $state) {

        var ctrl = this;
        ctrl.title = 'HMC';

        ctrl.items = Routes.routes;
        ctrl.isLoggedIn = Auth.isLoggedIn;
        ctrl.logout = function() {
          Auth.logout();
          $state.transitionTo('root.devices');
        };

        function hideLogin(item) {
          var loggedIn = Auth.isLoggedIn();
          return !(item.state === 'root.login' && loggedIn);
        }

        ctrl.getLeftItems = function() {
          return ctrl.items.filter(function(item) {
            return item.position === 'left' && hideLogin(item);
          });
        };

        ctrl.getRightItems = function() {
          return ctrl.items.filter(function(item) {
            return item.position === 'right' && hideLogin(item);
          });
        };

      }
    });

})();
