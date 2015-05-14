(function () {

  var module = angular.module('navbar', []);

  module.provider('Routes', function(){
    var routes = [
      {
        title: 'Devices',
        state: 'root.devices',
        url: '/devices',
        templateUrl: 'app/views/devices.html'
      },
      {
        title: 'Groups',
        state: 'root.groups',
        url: '/groups',
        templateUrl: 'app/views/groups.html'
      },
      {
        title: 'Create Group',
        state: 'root.groups.create',
        url: '/create',
        templateUrl: 'app/views/groups-create.html'
      },
      {
        title: 'Sensors',
        state: 'root.sensors',
        url: '/sensors',
        templateUrl: 'app/views/sensors.html'
      },
      {
        title: 'About',
        state: 'root.about',
        url: '/about',
        templateUrl: 'app/views/about.html'
      },
      {
        title: 'Configuration',
        state: 'root.configuration',
        url: '/config',
        templateUrl: 'app/views/configuration.html'
      }
    ];

    return {
      $get: function(){
        return {routes: routes};
      }
    }

  });

  module.controller('NavbarCtrl', function (Routes) {

    var ctrl = this;
    ctrl.title = 'Home Master Controller';

    ctrl.items = Routes.routes;

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
