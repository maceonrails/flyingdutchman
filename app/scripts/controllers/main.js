'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('MainCtrl',
    function ($rootScope, localStorageService, $state, currentUser, $timeout, $stateParams) {
      $rootScope.$state        = $state;
      $rootScope.token         = $stateParams.token; // set token from params
      $rootScope.user          = currentUser;
      $rootScope.stateWithList = ['app.restricted.users'];
      $rootScope.state         = $state;

      var token = localStorageService.get('token');
      if (token === null){
        $state.go('welcome');
      }

      $rootScope.doLogout = function(){
        delete $rootScope.token;
        localStorageService.remove('token');
        $timeout(function () {
          $state.go('welcome');
        }, 100);
      };
  });
