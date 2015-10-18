'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:outletsCtrl
 * @description
 * # outletsCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('TablesCtrl', function ($scope, $rootScope, Table, lodash) {
    $scope.tables         = {};
    $scope.selected       = {};
    $scope.formType       = 'new';
    $scope.selectedID     = null;
    $rootScope.controller = 'tables';
    $rootScope.canAdd     = true;
    $rootScope.total      = 1;


    // ng init
    $rootScope.initial = function(xpage){
      console.log(xpage);
      Table.getData()
        .then(
          function(res){
            if (res.tables !== undefined) {
              $scope.tables = [];
              var tables    = res.tables;
              var locations = lodash.groupBy(tables, function(t){return t.location; });

              lodash.each(locations, function(loc){
                var arrTable    = lodash.sortBy(loc, function(l){ return l.name; });
                var tableHolder = {
                  location: lodash.first(arrTable).location,
                  start: parseInt(lodash.first(arrTable).name),
                  end: parseInt(lodash.last(arrTable).name)
                };
                $scope.tables.push(tableHolder);
              });

              jQuery('.search').removeClass('loading');
              if ($scope.tables.length > 0) {
                $scope.selected        = angular.copy($scope.tables[0]);
                $scope.formType        = 'existing';
                $scope.selectedID      = 0;
              }else {
                $scope.selected   = {};
                $scope.formType   = 'new';
              }
            }
          });
    };

    $rootScope.addNew = function(){
      $scope.selected       = {};
      $scope.selected.result= '';
      $scope.formType       = 'new';
    };

    $scope.selectTable = function(idx){
      $scope.selected   = angular.copy($scope.tables[idx]);
      $scope.selectedID = idx;
      $scope.formType   = 'existing';

      jQuery('label.error').remove();
      jQuery('input.error, select.error, textarea.error').removeClass('error');
    };

    $scope.saveData = function(){
      var form        = jQuery('.entry-form');
      form.validate();
      $scope.hasError = $scope.selected.start > $scope.selected.end;

      if (form.valid() && !$scope.hasError){

        if ($scope.formType === 'new'){
          Table.save($scope.selected)
            .then(function(res){
              $scope.tables.push(res.table);
              $scope.selected  = angular.copy(res.table);
              $scope.formType  = 'existing';
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Table.handle422(err.data);
                _removeDimmer();
              }
            });
        }else {
          Table.update($scope.selected)
            .then(function(res){
              $scope.tables[$scope.selectedID] = res.table;
              $scope.selected                  = angular.copy(res.table);
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Table.handle422(err.data);
                _removeDimmer();
              }
            });
        }
      }
    };

    $scope.deleteData = function(){
      $scope.selected.start = 0;
      $scope.selected.end   = 0;

      Table.update($scope.selected)
        .then(function(){
          $scope.tables.splice($scope.selectedID, 1);
          if ( $scope.tables.length > 0 ){
            $scope.selectedID = 0;
            $scope.selectTable(0);
          }else {
            $scope.selected  = {};
            $scope.formType  = 'new';
          }
          _removeDimmer();
        },
        function(err){
          if (err.status === 422){
            Table.handle422(err.data);
            _removeDimmer();
          }
        });
    };

    var _removeDimmer = function(){
      jQuery('.content-workspace > .dimmer').removeClass('active');
    };
  });
