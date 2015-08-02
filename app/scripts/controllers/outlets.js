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
                $scope.formType   = 'existing';
                $scope.selectedID = 0;
              }else {
                $scope.selected   = {};
                $scope.formType   = 'new';
              }
            }
          });
    };

    $rootScope.addNew = function(){
      $scope.selected = {};
      $scope.formType = 'new';
    };

    $scope.selectOutlet = function(idx){
      $scope.selected   = angular.copy($scope.outlets[idx]);
      $scope.selectedID = idx;
      $scope.formType   = 'existing';

      jQuery('label.error').remove();
      jQuery('input.error, select.error, textarea.error').removeClass('error');
    };

    $scope.saveData = function(){
      var form = jQuery('.entry-form');
      form.validate();
      if (form.valid()){
        if ($scope.formType === 'new'){
          Outlet.save($scope.selected)
            .then(function(res){
              $scope.outlets.push(res.outlet);
              $scope.selected = angular.copy(res.outlet);
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
              $scope.selected = angular.copy(res.outlet);
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
  });
