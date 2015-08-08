'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:discountsCtrl
 * @description
 * # discountsCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('DiscountsCtrl', function ($scope, $rootScope, Discount, Cloud, Outlet, Restangular) {
    $scope.discounts      = {};
    $scope.canAdd         = false;
    $rootScope.controller = 'discounts';
    $rootScope.canAdd     = false;

    // ng init
    $rootScope.initial = function(xpage){
      var page = xpage || 1;
      Discount.getData(page)
        .then(
          function(res){
            $scope.discounts = res.discounts;
          });
    };

    $scope.resync = function(){
      Outlet.getData(1).then(function(res){
        if (res.outlets && res.outlets.length > 0){
          var outlet_id = res.outlets[0].id;
          Cloud.one('discounts', 'all').customGET('', {outlet_id: outlet_id})
            .then(function(res){
              Restangular.all('sync')
                .customPOST(res, null, {}, {})
                .then(function(){
                  $rootScope.initial(1);
                });
              $scope.discountLoading = false;
            });
        }else {
          $scope.discountLoading = false;
        }
      });
    };
  });
