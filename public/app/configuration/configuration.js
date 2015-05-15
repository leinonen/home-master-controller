(function () {

  var module = angular.module('configuration', ['message']);

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

  module.controller('EditConfigCtrl', function (ConfigService, Message) {
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
    ConfigService.getConfiguration().then(function (cfg) {
      ctrl.config = cfg;
    }).catch(function (err) {
      Message.danger(err.data);
    });

    ctrl.saveConfiguration = function () {
      console.log('saving');
      ConfigService.saveConfiguration(ctrl.config).then(function (cfg) {
        ctrl.config = cfg;
        Message.success('Configuration saved!');
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
