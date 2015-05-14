(function () {

  var app = angular.module('app', [
    'ui.router',

    'configuration',
    'hmc',
    'sensor',
    'device',
    'group',
    'navbar'
  ]);

  app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
      url: '',
      abstract: true,
      views: {
        'header': {
          templateUrl: 'app/views/header.html'
        },
        'footer': {
          templateUrl: 'app/views/footer.html'
        }
      }
    });

    var routes = [
      {
        state: 'devices',
        url: '/devices',
        templateUrl: 'app/views/devices.html'
      },
      {
        state: 'groups',
        url: '/groups',
        templateUrl: 'app/views/groups.html'
      },
      {
        state: 'sensors',
        url: '/sensors',
        templateUrl: 'app/views/sensors.html'
      },
      {
        state: 'about',
        url: '/about',
        templateUrl: 'app/views/about.html'
      },
      {
        state: 'configuration',
        url: '/config',
        templateUrl: 'app/views/configuration.html'
      }
    ];

    angular.forEach(routes, function (route) {
      $stateProvider.state('root.' + route.state, {
        url: route.url,
        views: {
          'container@': {
            templateUrl: route.templateUrl
          }
        }
      });
    });

  });


  app.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $state.transitionTo('root.devices', {page: 0});
  });

})();
