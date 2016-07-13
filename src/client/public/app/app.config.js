(function () {

  var app = angular.module('app');

  app.config(function ($stateProvider, $urlRouterProvider, RoutesProvider, $httpProvider) {

    $httpProvider.interceptors.push('authInterceptor');

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

    function addRoute(route){
      var containerNode = {};
      if (route.template) {
        containerNode.template = route.template;
      } else if (route.templateUrl) {
        containerNode.templateUrl = route.templateUrl;
      }

      $stateProvider.state(route.state, {
        url: route.url,
        views: {
          'container@': containerNode
        },
        authenticate: route.authenticate || false
      });
    }

    angular.forEach(RoutesProvider.$get().routes, function (route) {
      addRoute(route);
      if (route.children){
        angular.forEach(route.children, function(child) {
          addRoute(child);
        });
      }
    });

  });

  app.run(function ($rootScope, $state, $stateParams, $location, Auth, Socket, $interval) {

    $interval(function() {
      Socket.getSensors();
    }, 10 * 1000);

    //Socket.getDevices();

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $state.transitionTo('root.login');
        }
      });
    });

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $state.transitionTo('root.devices');
  });

})();
