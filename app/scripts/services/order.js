'use strict';

angular.module('erestoApp')
  .factory('Order', function (Restangular) {
    return {
      getData: function(query) {
        return Restangular.one('orders', 'search').customGET('', query);
      }
    };
  });