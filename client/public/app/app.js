(function () {

  var app = angular.module('app', [
    'ngCookies',
    'ngResource',
    'ui.router',
    'angular-loading-bar',

    'auth',
    'common',
    'message',
    'configuration',
    'master',
    'sensor',
    'device',
    'group',
    'navbar',
    'scheduler'
  ]);

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
      $stateProvider.state(route.state, {
        url: route.url,
        views: {
          'container@': {
            templateUrl: route.templateUrl
          }
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

  app.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  });

  app.run(function ($rootScope, $state, $stateParams, $location, Auth) {

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
