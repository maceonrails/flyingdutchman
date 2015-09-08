'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $stateParams, Order, lodash) {
    $rootScope.token        = $stateParams.token; // set token from params
    $rootScope.graphRevenue = 'this_week';
    $rootScope.graphOrder   = 'this_week';
    $scope.exampleData      = [];

    var _reloadRevenue = function(){
      Order.getGraphRevenue({timeframe: $rootScope.graphRevenue}).then(function(res){
        $scope.exampleData  = [{key: 'Revenue', values: res}];
        $scope.totalRevenue = 'Rp '+d3.format(',')(lodash.sum(res, function(n){ return n[1];}));
      });
    };

    _reloadRevenue();

    $rootScope.$watch('graphRevenue', function(oldval, newval){
      if (oldval !== newval){
        _reloadRevenue();
      }
    });

    var _reloadOrder = function(){
      Order.getGraphOrder({timeframe: $rootScope.graphOrder}).then(function(res){
        $scope.exampleData2  = [{key: 'Order', values: res}];
        $scope.totalOrder    = lodash.sum(res, function(n){ return n[1];});
      });
    };

    _reloadOrder();

    $rootScope.$watch('graphOrder', function(oldval, newval){
      if (oldval !== newval){
        _reloadOrder();
      }
    });

    $scope.xFormat = function(data){
      return moment(data).format('DD/MM/YYYY');
    };

    $scope.yFormat = function(d){
      return d3.format(',')(d);
    };

    $scope.yPadding = function(){
      return 100;
    };
  });
