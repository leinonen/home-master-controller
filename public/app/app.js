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

  app.config(function ($stateProvider, $urlRouterProvider, RoutesProvider) {

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

    angular.forEach(RoutesProvider.$get().routes, function (route) {
      $stateProvider.state(route.state, {
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
