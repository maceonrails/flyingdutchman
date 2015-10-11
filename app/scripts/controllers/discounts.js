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
              $scope.discountType = $scope.selected.percentage ? 'percentage' : 'amount';
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

    $scope.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.time = [
      '00:00', '00:10', '00:20', '00:30', '00:40', '00:50',
      '01:00', '01:10', '01:20', '01:30', '01:40', '01:50',
      '02:00', '02:10', '02:20', '02:30', '02:40', '02:50',
      '03:00', '03:10', '03:20', '03:30', '03:40', '03:50',
      '04:00', '04:10', '04:20', '04:30', '04:40', '04:50',
      '05:00', '05:10', '05:20', '05:30', '05:40', '05:50',
      '06:00', '06:10', '06:20', '06:30', '06:40', '06:50',
      '07:00', '07:10', '07:20', '07:30', '07:40', '07:50',
      '08:00', '08:10', '08:20', '08:30', '08:40', '08:50',
      '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
      '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
      '11:00', '11:10', '11:20', '11:30', '11:40', '11:50',
      '12:00', '12:10', '12:20', '12:30', '12:40', '12:50',
      '13:00', '13:10', '13:20', '13:30', '13:40', '13:50',
      '14:00', '14:10', '14:20', '14:30', '14:40', '14:50',
      '15:00', '15:10', '15:20', '15:30', '15:40', '15:50',
      '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
      '17:00', '17:10', '17:20', '17:30', '17:40', '17:50',
      '18:00', '18:10', '18:20', '18:30', '18:40', '18:50',
      '19:00', '19:10', '19:20', '19:30', '19:40', '19:50',
      '20:00', '20:10', '20:20', '20:30', '20:40', '20:50',
      '21:00', '21:10', '21:20', '21:30', '21:40', '21:50',
      '22:00', '22:10', '22:20', '22:30', '22:40', '22:50',
      '23:00', '23:10', '23:20', '23:30', '23:40', '23:50'
    ];

    $scope.checkType = function(){
      if ($scope.discountType === 'percentage'){
        $scope.selected.amount = null;
      }else {
        $scope.selected.percentage = null;
      }
    };

    $scope.selectDiscount = function(idx){
      $scope.selected   = angular.copy($scope.discounts[idx]);
      $scope.discountType = $scope.selected.percentage ? 'percentage' : 'amount';
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
        var prd     = lodash.find($scope.products, function(r){return r.id === $scope.selected.product_id;});
        var disct   = percent * prd.price;
        $scope.selected.amount = disct;
      }
    }, true);

    var _removeDimmer = function(){
      jQuery('.content-workspace > .dimmer').removeClass('active');
    };
  });
