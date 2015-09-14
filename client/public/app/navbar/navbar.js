(function () {

  var module = angular.module('navbar', []);

  module.provider('Routes', function () {
    var routes = [
      {
        title: 'Devices',
        state: 'root.devices',
        url: '/devices',
        templateUrl: 'app/views/devices.html',
        position: 'left'
      },
      {
        title: 'Groups',
        state: 'root.groups',
        url: '/groups',
        templateUrl: 'app/views/groups.html',
        position: 'left',

        children: [{
          title: 'Create Group',
          state: 'root.groups.create',
          url: '/create',
          templateUrl: 'app/views/groups-create.html'
        }]
      },
      {
        title: 'Edit group',
        state: 'root.groups.edit',
        url: '/edit/:type/:id',
        templateUrl: 'app/views/group-edit.html',
        position: 'hidden'
      },

      {
        title: 'Sensors',
        state: 'root.sensors',
        url: '/sensors',
        templateUrl: 'app/views/sensors.html',
        position: 'left'
      },
      {
        title: 'Scheduler',
        state: 'root.scheduler',
        url: '/scheduler',
        templateUrl: 'app/views/scheduler.html',
        position: 'left'
      },
      {
        title: 'Create Schedule',
        state: 'root.scheduler.create',
        url: '/create',
        templateUrl: 'app/views/scheduler-create.html',
        position: 'hidden'
      },
      {
        title: 'Edit Schedule',
        state: 'root.scheduler.edit',
        url: '/edit/:id',
        templateUrl: 'app/views/scheduler-edit.html',
        position: 'hidden'
      },
      {
        title: 'Configuration',
        state: 'root.configuration',
        url: '/config',
        templateUrl: 'app/views/configuration.html',
        position: 'right',
        icon: 'glyphicon glyphicon-cog'
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
      $get: function () {
        return {routes: routes};
      }
    }

  });

  module.controller('NavbarCtrl', function (Routes) {

    var ctrl = this;
    ctrl.title = 'Master Controller';

    ctrl.items = Routes.routes;

    ctrl.getLeftItems = function () {
      return ctrl.items.filter(function(item){
        return item.position === 'left';
      });
    };

    ctrl.getRightItems = function () {
      return ctrl.items.filter(function(item){
        return item.position === 'right';
      });
    };

  });

  module.directive('navbar', function () {
    return {
      scope: {},
      templateUrl: 'app/navbar/navbar.html',
      replace: true,
      controller: 'NavbarCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
