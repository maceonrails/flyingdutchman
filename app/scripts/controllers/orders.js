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
    $rootScope.controller  = 'reports';
    $rootScope.filter      = {};
    $rootScope.filter.page = 1;
    $rootScope.total       = 1;

    var d = new Date();
    $rootScope.filter.dateEnd   = moment(d).format('DD/MM/YYYY');
    $rootScope.filter.dateStart = moment(d.setDate(d.getDate() - 7)).format('DD/MM/YYYY');

    var _calculateTotal = function(data){
      return isNaN(Math.ceil(data/10)) ? 1 : Math.ceil(data/10);
    };

    var _reloadOrders = function(){
      jQuery('.dimmer.orders').addClass('active');
      Order.getData($rootScope.filter).then(function(res){
        $rootScope.orders   = res.orders;
        $rootScope.total    = _calculateTotal(res.total);
        $rootScope.selected = res.orders[0];
        jQuery('.dimmer.orders').removeClass('active');
      }, function(){
        jQuery('.dimmer.orders').removeClass('active');
      });
    };

    _reloadOrders();

    $scope.viewData = function(order){
      $rootScope.selected = order;
      jQuery('.content-workspace').addClass('active');
    };

    $scope.searchData = function(){
      _reloadOrders();
    };

    $scope.dataPage = function(page){
      $rootScope.filter.page = page;
      _reloadOrders();
    };

  });
