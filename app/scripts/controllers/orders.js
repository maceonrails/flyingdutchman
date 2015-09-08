'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('OrdersCtrl', function ($scope, $rootScope, Order) {
    $rootScope.orders      = [];
    $rootScope.controller  = 'Orders';

    // var _calculateTotal = function(data){
    //   return isNaN(Math.ceil(data/10)) ? 1 : Math.ceil(data/10);
    // };

    var _reloadOrders = function(){
      Order.getData({type: 'today'}).then(function(res){
        var orders = [];
        var food   = false;

        for (var i = 0; i < res.orders.length; i++) {
          var have_food = false;
          var order     = res.orders[i];
          for (var j = 0; j < order.products.length; j++) {
            var item    = order.products[j];
            var checker = food ? item.serv_category === 'FOODS' : item.serv_category !== 'FOODS';
            if (!item.served && checker){
              have_food = true;
              if (item.note){
                res.orders[i].products[j].note = res.orders[i].products[j].note.split(',');
              }else{
                res.orders[i].products[j].note = [];
              }
              if (item.choice){
                res.orders[i].products[j].note.push(item.choice);
              }
            }
          }

          if (have_food){
            orders.push(res.orders[i]);
          }
        }

        $scope.orders = orders;
      });
    };

    _reloadOrders();
  });
