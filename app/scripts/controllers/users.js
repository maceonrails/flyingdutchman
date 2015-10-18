'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('UsersCtrl', function ($scope, $rootScope, User) {
    $scope.users          = {};
    $scope.selected       = {};
    $scope.formType       = 'existing';
    $scope.selectedID     = null;
    $rootScope.controller = 'users';
    $rootScope.total      = 1;

    // ng init
    $rootScope.initial = function(xpage){
      var page = xpage || 1;
      User.eresto(page)
        .then(
          function(res){
            $scope.users    = res.users;
            jQuery('.search').removeClass('loading');
            if (res.users.length > 0) {
              $scope.selected   = angular.copy(res.users[0]);
              $scope.selectedID = 0;
              _changeDateSelected();
            }
          });
    };

    $rootScope.addNew = function(){
      $scope.selected = {};
      $scope.formType = 'new';
    };

    $scope.selectUser = function(idx){
      $scope.selected = angular.copy($scope.users[idx]);
      $scope.selectedID = idx;
      $scope.formType = 'existing';

      jQuery('label.error').remove();
      jQuery('input.error, select.error, textarea.error').removeClass('error');
      _changeDateSelected();
    };

    $scope.saveData = function(){
      var form = jQuery('.entry-form');
      form.validate();
      if (form.valid()){
        $scope.selected.profile_attributes.join_at        =
          _changeDateToSave($scope.selected.profile_attributes.join_at);
        $scope.selected.profile_attributes.contract_until =
          _changeDateToSave($scope.selected.profile_attributes.contract_until);

        if ($scope.formType === 'new'){
          $scope.selected.role = 'eresto';
          User.save($scope.selected)
            .then(function(res){
              $scope.users.push(res.user);
              $scope.selected = angular.copy(res.user);
              _changeDateSelected();
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                User.handle422(err.data);
                _removeDimmer();
              }
            });
        }else {
          User.update($scope.selected)
            .then(function(res){
              $scope.users[$scope.selectedID] = res.user;
              $scope.selected = angular.copy(res.user);
              _changeDateSelected();
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                User.handle422(err.data);
                _removeDimmer();
              }
            });
        }
      }
    };

    var _removeDimmer = function(){
      jQuery('.content-workspace > .dimmer').removeClass('active');
    };

    var _changeDateToDisplay = function(data){
      if (data !== null || data !== undefined){
        return moment(data).format('ddd, D MMM YYYY');
      }
      return ' ';
    };

    var _changeDateToSave = function(data){
      if (data !== null || data !== undefined){
        return moment(data).format('YYYY-MM-D');
      }
      return ' ';
    };

    var _changeDateSelected = function(){
      $scope.selected.profile_attributes.join_at        =
        _changeDateToDisplay($scope.selected.profile_attributes.join_at);
      $scope.selected.profile_attributes.contract_until =
        _changeDateToDisplay($scope.selected.profile_attributes.contract_until);
    };
  });
