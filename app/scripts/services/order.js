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
      updateItemServed: function(id) {
        return Restangular.all('order_items').one(id, 'toggle_served')
          .customPUT({}, null, {}, {});
      },
      updateOrderServed: function(id) {
        return Restangular.all('orders').one(id, 'toggle_served')
          .customPUT({}, null, {}, {});
      },
      updatePantryServed: function(id) {
        return Restangular.all('orders').one(id, 'toggle_pantry')
          .customPUT({}, null, {}, {});
      },
    };
  });
