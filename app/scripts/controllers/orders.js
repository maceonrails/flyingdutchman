'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('OrdersCtrl', function ($scope, $rootScope, Order, $interval, $state) {
    $rootScope.orders      = [];
    $rootScope.controller  = 'Orders';

    var _reloadOrders = function(){
      Order.getData({type: 'today'}).then(function(res){
        var orders = [];
        var food   = $rootScope.user.role === 'chef';

        for (var i = 0; i < res.orders.length; i++) {
          var have_food = false;
          var order     = res.orders[i];
          var deleteIdx = [];
          var unserved  = 0;
          for (var j = 0; j < order.products.length; j++) {
            var item    = order.products[j];
            var checker = false;

            if (food) {
              checker = item.serv_category === 'FOODS';
            }else {
              checker = item.serv_category !== 'FOODS';
            }
            if (checker){
              if (!item.served){
                unserved++;
              }

              have_food = true;
              if ((item.note !== null) && (item.note !== '')){
                res.orders[i].products[j].note = item.note.split(',');
              } else {
                res.orders[i].products[j].note = [];
              }

              if (item.choice){
                res.orders[i].products[j].note.push(item.choice);
              }

              if (res.orders[i].products[j].note.length === 1 && res.orders[i].products[j].note[0] === ''){
                res.orders[i].products[j].note = null;
              }
            }else{
              deleteIdx.push(j);
            }
          }

          //delete data
          // var holder = angular.copy(res.orders);
          for (var k = deleteIdx.length - 1; k >= 0; k--) {
            res.orders[i].products.splice(deleteIdx[k],1);
          }

          if (have_food && !order.created){
            var ordObj      = res.orders[i];
            ordObj.unserved = unserved;
            orders.push(ordObj);
          }
        }
        $scope.orders = orders;
      });
    };

    $rootScope.reload  = function(){
      console.log('reloaded');
      _reloadOrders();
    };

     $rootScope.interval = $interval(_reloadOrders, 30000);
    _reloadOrders();
  });
