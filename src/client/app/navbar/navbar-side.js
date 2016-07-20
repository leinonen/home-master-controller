'use strict';

(function() {

  angular.module('app')
    .component('navbarSide', {
      bindings: {},
      templateUrl: 'app/navbar/navbar-side.html',
      controller: function(Routes, Auth) {

        var ctrl = this;

        ctrl.items = Routes.routes;

        ctrl.isLoggedIn = Auth.isLoggedIn;

        function hideLogin(item) {
          var loggedIn = Auth.isLoggedIn();
          return !(item.state === 'root.login' && loggedIn);
        }

        ctrl.getLeftItems = function() {
          return ctrl.items.filter(function(item) {
            return item.position === 'left' && hideLogin(item);
          });
        };

      }
    });

})();
