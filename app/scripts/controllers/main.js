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
      $rootScope.stateWithList = ['app.restricted.users', 'app.restricted.outlets', 
                                  'app.restricted.staff', 'app.restricted.products'];
      $rootScope.state         = $state;
      $rootScope.page          = 1;
      $rootScope.controller    = 'default';
      $rootScope.search        = null;

      $rootScope.countPage = function(){
        return isNaN(Math.ceil($rootScope.total/10)) ? 1 : Math.ceil($rootScope.total/10);
      };

      $rootScope.nextPage = function(){
        if ($rootScope.countPage() > $rootScope.page){
          $rootScope.page += 1;
          $rootScope.initial($rootScope.page);
        }
      };

      $rootScope.prevPage = function(){
        if ($rootScope.page > 1){
          $rootScope.page -= 1;
          $rootScope.initial($rootScope.page);
        }
      };

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
