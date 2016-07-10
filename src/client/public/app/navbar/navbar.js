(function() {

  angular.module('app').provider('Routes', function() {
    var routes = [
      {
        title: 'Devices',
        icon: 'glyphicon glyphicon-list',
        state: 'root.devices',
        url: '/devices',
        template: '<device-list/>',
        position: 'left',
        authenticate: true
      },
      {
        title: 'Groups',
        icon: 'glyphicon glyphicon-folder-open',
        state: 'root.groups',
        url: '/groups',
        template: '<group-list/>',
        position: 'left',
        authenticate: true,

        children: [{
          title: 'Create Group',
          state: 'root.groups.create',
          url: '/create',
          template: '<group-edit/>',
          authenticate: true
        }]
      },
      {
        title: 'Edit group',
        state: 'root.groups.edit',
        url: '/edit/:type/:id',
        template: '<group-edit/>',
        position: 'hidden',
        authenticate: true
      },

      {
        title: 'Sensors',
        icon: 'glyphicon glyphicon-eye-open',
        state: 'root.sensors',
        url: '/sensors',
        template: '<sensor-list/>',
        position: 'left',
        authenticate: true
      },
      {
        title: 'Scheduler',
        icon: 'glyphicon glyphicon-calendar',
        state: 'root.scheduler',
        url: '/scheduler',
        template: '<scheduler-list/>',
        position: 'left',
        authenticate: true
      },
      {
        title: 'Create Schedule',
        state: 'root.scheduler.create',
        url: '/create',
        template: '<scheduler-edit/>',
        position: 'hidden',
        authenticate: true
      },
      {
        title: 'Edit Schedule',
        state: 'root.scheduler.edit',
        url: '/edit/:id',
        template: '<scheduler-edit/>',
        position: 'hidden',
        authenticate: true
      },
      {
        title: 'Config',
        state: 'root.configuration',
        url: '/config',
        template: '<edit-configuration/>',
        position: 'right',
        icon: 'glyphicon glyphicon-cog',
        authenticate: true
      },
      {
        title: 'Events',
        icon: 'glyphicon glyphicon-bullhorn',
        state: 'root.events',
        url: '/events',
        template: '<event-list/>',
        position: 'left',
        authenticate: true,
        children: [{
          title: 'Create Event',
          state: 'root.events.create',
          url: '/create',
          template: '<create-event/>',
          position: 'left',
          hidden: true,
          authenticate: true
        },
          {
            title: 'Edit Event',
            state: 'root.events.edit',
            url: '/edit/:id',
            template: '<create-event/>',
            position: 'left',
            hidden: true,
            authenticate: true
          }]
      },
      {
        title: 'Login',
        url: '/login',
        state: 'root.login',
        template: '<login/>',
        controller: 'LoginCtrl',
        position: 'right'
      },
      {
        title: 'Account',
        icon: 'glyphicon glyphicon-user',
        url: '/settings',
        state: 'root.settings',
        template: '<settings/>',
        controller: 'LoginCtrl',
        position: 'right',
        authenticate: true
      },
      {
        title: 'About',
        state: 'root.about',
        url: '/about',
        templateUrl: 'app/views/about.html',
        position: 'right'
      }
    ];

    return {
      $get: function() {
        return {
          routes: routes
        };
      }
    }

  });

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
          return !(item.state === 'root.login' && loggedIn)
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

  angular.module('app')
    .component('navbarSide', {
      bindings: {},
      templateUrl: 'app/navbar/navbar-side.html',
      controller: function(Routes, Auth, $state) {

        var ctrl = this;

        ctrl.items = Routes.routes;

        ctrl.isLoggedIn = Auth.isLoggedIn;

        function hideLogin(item) {
          var loggedIn = Auth.isLoggedIn();
          return !(item.state === 'root.login' && loggedIn)
        }

        ctrl.getLeftItems = function() {
          return ctrl.items.filter(function(item) {
            return item.position === 'left' && hideLogin(item);
          });
        };


      }
    });

})();
