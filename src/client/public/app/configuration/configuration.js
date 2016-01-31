(function () {

  var module = angular.module('app');

  module.service('ConfigService', function ($http) {
    var apiEndpoint = '/api/config/configuration';

    this.getConfiguration = function () {
      return $http.get(apiEndpoint).then(function (response) {
        return response.data;
      });
    };

    this.saveConfiguration = function (cfg) {
      return $http.post(apiEndpoint, cfg).then(function (response) {
        return response.data;
      });
    };

  });

  module.controller('EditConfigCtrl', function (ConfigService, Message, ErrorHandler) {
    var ctrl = this;
    ctrl.config = {
      telldus: {
        enabled: false,
        publicKey: '',
        privateKey: '',
        accessToken: '',
        accessTokenSecret: ''
      },
      hue: {
        enabled: false,
        endpoint: ''
      },
      zwave: {
        enabled: false,
        endpoint: '',
        username: '',
        password: ''
      }
    };

    ConfigService.getConfiguration().then(function (cfg) {
      ctrl.config = cfg;
    }).catch(ErrorHandler.handle);

    ctrl.saveConfiguration = function () {
      ConfigService.saveConfiguration(ctrl.config)
        .then(function (cfg) {
          ctrl.config = cfg;
          console.log('Configuration saved');
          Message.success('Configuration saved!');
        })
        .catch(ErrorHandler.handle);
    }
  });

  module.directive('editConfiguration', function () {
    return {
      scope: {},
      templateUrl: 'app/configuration/configuration-form.html',
      controller: 'EditConfigCtrl',
      controllerAs: 'ctrl'
    }
  });

})();
