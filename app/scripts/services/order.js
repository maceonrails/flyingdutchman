'use strict';

angular.module('erestoApp')
  .factory('Order', function (Restangular) {
    return {
      getData: function(query) {
        return Restangular.one('orders', 'search').customGET('', query);
      },
      getGraphRevenue: function(query) {
        return Restangular.one('orders', 'graph_by_revenue').customGET('', query);
      },
      getGraphOrder: function(query) {
        return Restangular.one('orders', 'graph_by_order').customGET('', query);
      },
      getGraphPax: function(query) {
        return Restangular.one('orders', 'graph_by_pax').customGET('', query);
      }
    };
  });