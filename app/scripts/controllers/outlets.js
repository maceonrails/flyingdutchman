'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:outletsCtrl
 * @description
 * # outletsCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('OutletsCtrl', function ($scope, $rootScope, Outlet) {
    $scope.outlets        = {};
    $scope.selected       = {};
    $scope.formType       = 'new';
    $scope.selectedID     = null;
    $rootScope.controller = 'outlets';

    // ng init
    $rootScope.initial = function(xpage){
      var page = xpage || 1;
      Outlet.getData(page)
        .then(
          function(res){
            if (res.outlets !== undefined) {
              $scope.outlets = res.outlets;
              jQuery('.search').removeClass('loading');
              if (res.outlets.length > 0) {
                $scope.selected   = angular.copy(res.outlets[0]);
                $scope.selected.taxs = _objToArr(res.outlets[0].taxs);
                $scope.formType   = 'existing';
                $scope.selectedID = 0;
              }else {
                $scope.selected   = {};
                $scope.formType   = 'new';
              }
            }
          });
    };

    var _objToArr  = function(obj){
      if(obj === null || obj === undefined){ obj = {}; }
      return Object.keys(obj).map(function (key) {return {label: key, value: obj[key]}; });
    };

    var _arrToObj  = function(arr){
      if(arr === null || arr === undefined){ arr = []; }
      var to_return =  {};
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].value !== '0' && arr[i].value !== '' && arr[i].label !== ''){
          to_return[arr[i].label] = arr[i].value;
        }
      }
      return to_return;
    };

    $rootScope.addNew = function(){
      $scope.selected = {};
      $scope.formType = 'new';
    };

    $scope.selectOutlet = function(idx){
      $scope.selected   = angular.copy($scope.outlets[idx]);
      $scope.selected.taxs = _objToArr($scope.outlets[idx].taxs);
      $scope.selectedID = idx;
      $scope.formType   = 'existing';

      jQuery('label.error').remove();
      jQuery('input.error, select.error, textarea.error').removeClass('error');
    };

    $scope.addTax = function(){
      if (!$scope.selected.taxs){
        $scope.selected.taxs = [];
      }
      $scope.selected.taxs.push({label: '', value: 0});
    };

    $scope.removeTax = function(idx){
      $scope.selected.taxs.splice(idx, 1);
    };

    $scope.saveData = function(){
      var form = jQuery('.entry-form');
      form.validate();
      if (form.valid()){
        $scope.selected.taxs = _arrToObj($scope.selected.taxs);
        if ($scope.formType === 'new'){
          Outlet.save($scope.selected)
            .then(function(res){
              $scope.outlets.push(res.outlet);
              $scope.selected      = angular.copy(res.outlet);
              $scope.selected.taxs = _objToArr(res.outlet.taxs);
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Outlet.handle422(err.data);
                _removeDimmer();
              }
            });
        }else {
          Outlet.update($scope.selected)
            .then(function(res){
              $scope.outlets[$scope.selectedID] = res.outlet;
              $scope.selected      = angular.copy(res.outlet);
              $scope.selected.taxs = _objToArr(res.outlet.taxs);
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Outlet.handle422(err.data);
                _removeDimmer();
              }
            });
        }
      }
    };

    var _removeDimmer = function(){
      jQuery('.content-workspace > .dimmer').removeClass('active');
    };

    $scope.deleteData = function(){
      Outlet.delete($scope.selected).then(function(res){
        $rootScope.initial();
        $scope.errorMessage = null;
        _removeDimmer();
      }, function(err){
        $scope.errorMessage = err.data.message;
        _removeDimmer()
      });
      
    }
  });
