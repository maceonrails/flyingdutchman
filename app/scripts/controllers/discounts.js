'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:discountsCtrl
 * @description
 * # discountsCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('DiscountsCtrl', function ($scope, $rootScope, Discount, Restangular, lodash) {
    $scope.discounts      = {};
    $scope.selected       = {};
    $scope.products       = [];
    $scope.outlets        = [];
    $scope.formType       = 'existing';
    $scope.selectedID     = null;
    $rootScope.controller = 'discounts';

    // ng init
    $rootScope.initial = function(xpage){
      var page = xpage || 1;
      Discount.getData(page)
        .then(
          function(res){
            $scope.discounts    = res.discounts;
            jQuery('.search').removeClass('loading');
            if (res.discounts.length > 0) {
              $scope.selected   = angular.copy(res.discounts[0]);
              $scope.selectedID = 0;
            }else{
              $scope.formType   = 'new';
            }
          });

      Restangular.one('products', 'all').get()
        .then(function(res){
          $scope.products =  res.products;
        });

      Restangular.one('outlets', 'all').get()
        .then(function(res){
          $scope.outlets =  res.outlets;
        });
    };

    $rootScope.addNew = function(){
      $scope.selected = {};
      $scope.formType = 'new';
      jQuery('.selection.dropdown .text').html('Select Product');
    };

    $scope.selectDiscount = function(idx){
      $scope.selected   = angular.copy($scope.discounts[idx]);
      $scope.selectedID = idx;
      $scope.formType   = 'existing';

      jQuery('label.error').remove();
    };

    $scope.saveData = function(){
      var form = jQuery('.entry-form');
      form.validate();

      if (form.valid()){
        if ($scope.formType === 'new'){
          Discount.save($scope.selected)
            .then(function(res){
              $scope.discounts.push(res.discount);
              $scope.selected = angular.copy(res.discount);
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Discount.handle422(err.data);
                _removeDimmer();
              }
            });
        }else {
          Discount.update($scope.selected)
            .then(function(res){
              $scope.discounts[$scope.selectedID] = res.discount;
              $scope.selected = angular.copy(res.discount);
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Discount.handle422(err.data);
                _removeDimmer();
              }
            });
        }
      }
    };

    $scope.deleteData = function(){

      Discount.delete($scope.selected)
        .then(function(){
          $scope.discounts.splice($scope.selectedID, 1);
          if ( $scope.discounts.length > 0 ){
            $scope.selectedID = 0;
            $scope.selectDiscount(0);
          }else {
            $scope.selected       = {};
            $scope.formType       = 'new';
          }
          _removeDimmer();
        },
        function(err){
          if (err.status === 422){
            Discount.handle422(err.data);
            _removeDimmer();
          }
        });
    };

    $scope.$watch('selected', function(newVal, oldVal){
      if (newVal.percentage !== oldVal.percentage){
        var _isNaN  = isNaN(parseInt(newVal.percentage));
        var percent = _isNaN ? 0 : parseInt(newVal.percentage);
        percent     = percent / 100;
        var prd     = lodash.find($scope.products, function(r){return r.id === $scope.selected.product_id});
        var disct   = percent * prd.price;
        $scope.selected.amount = disct;
      }
    }, true);

    var _removeDimmer = function(){
      jQuery('.content-workspace > .dimmer').removeClass('active');
    };
  });
