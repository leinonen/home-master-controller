(function () {

  var module = angular.module('configuration', []);

  module.service('ConfigService', function ($http) {
    var ConfigService = this;
    ConfigService.getConfiguration = function () {
      return $http.get('/api/configuration').then(function (response) {
        return response.data;
      });
    };

    ConfigService.saveConfiguration = function (cfg) {
      return $http.post('/api/configuration', cfg).then(function (response) {
        return response.data;
      });
    };

  });

  module.controller('EditConfigCtrl', function (ConfigService) {
    var ctrl = this;
    ctrl.config = {
      telldus: {
        publicKey: '',
        privateKey: '',
        accessToken: '',
        accessTokenSecret: ''
      },
      hue: {
        endpoint: ''
      }
    };
    ctrl.message = '';
    ConfigService.getConfiguration().then(function (cfg) {
      ctrl.config = cfg;
    }).catch(function (err) {
      ctrl.message = err.data;
    });

    ctrl.saveConfiguration = function () {
      console.log('saving');
      ConfigService.saveConfiguration(ctrl.config).then(function (cfg) {
        ctrl.config = cfg;
        ctrl.message = 'Save successful';
        console.log('saved success!');
      });
    }
  });

  module.directive('editConfiguration', function () {
    return {
      scope: {},
      templateUrl: 'app/configuration/configuration-edit.html',
      controller: 'EditConfigCtrl',
      controllerAs: 'ctrl'
    }
  });

})();