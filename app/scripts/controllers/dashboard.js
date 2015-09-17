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
        var grouped2 = lodash.groupBy(res, function(n) { return n[0]; });
        var results2 = [];
        lodash.forEach(grouped2, function(n, key) {
          var tmp2 = [];
          tmp2[0]  = parseInt(key);
          tmp2[1]  = lodash.sum(n, function(b){ return b[1]; });
          results2.push(tmp2);
        });

        $scope.exampleData  = [{key: 'Revenue', values: results2}];
        $scope.totalRevenue = 'Rp '+d3.format(',')(lodash.sum(results2, function(n){ return n[1];}));
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
        var grouped = lodash.groupBy(res, function(n) { return n[0]; });
        var results = [];
        lodash.forEach(grouped, function(n, key) {
          var tmp = [];
          tmp[0]  = parseInt(key);
          tmp[1]  = lodash.sum(n, function(b){ return b[1]; });
          results.push(tmp);
        });

        $scope.exampleData2  = [{key: 'Order', values: results}];
        $scope.totalOrder    = lodash.sum(results, function(n){ return n[1];});
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
