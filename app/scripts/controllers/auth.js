'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('AuthCtrl', function ($scope, $rootScope, User, localStorageService, $state, $timeout) {
    var token = localStorageService.get('token');
    if (token !== null){
      $state.go('app.dashboard');
    }

    $scope.doLogin = function(){
      User.authenticate($scope.user)
        .then(function(response){
          localStorageService.set('token', response.token);
          $timeout(function(){
            $state.go('app.dashboard', { token: response.token });
          }, 200);
        }, function(){
          $scope.user = {};
          $rootScope.$broadcast('auth-error');
        });
    };
  });
