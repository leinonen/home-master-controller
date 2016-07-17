'use strict';

(function () {

  angular.module('app').service('Link', function ($rootScope, $http) {

    function unwrap(response) {
      return response.data;
    }

    this.hasLink = function(item, rel) {
      var links = item.links || [];
      return links.some(function(link) {
        return link.rel === rel;
      });
    };

    this.getLink = function(item, rel) {
      var links = item.links || [];
      return links.filter(function(link) {
        return link.rel === rel;
      })[0];
    };

    this._linkAction = function(link, value) {
      if (link.method === 'GET') {
        return $http.get(link.href).then(unwrap);

      } else if (link.method === 'POST') {
        if (value) {
          link.params.value = value;
        }
        console.log(link);
        return $http.post(link.href, link.params).then(unwrap);

      } else {
        console.log('Invalid link method');
      }
    };

    this.linkAction = function(link, value) {
      return this._linkAction(link, value)
        .then(function(data) {
          if (link.method === 'POST') {
            $rootScope.$emit('fetchDevices');
            $rootScope.$emit('fetchGroups');
          }
          return data;
      });
    };

  });

})();
