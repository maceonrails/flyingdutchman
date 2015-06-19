'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('AuthCtrl', function ($scope, $rootScope, User, localStorageService, $state) {
    var token = localStorageService.get('token');
    if (token !== null){
      $state.go('app.dashboard');
    }

    $scope.doLogin = function(){
      User.authenticate($scope.user)
        .then(function(response){
          localStorageService.set('token', response.token);
          $state.go('app.dashboard', { token: response.token });
        }, function(){
          $scope.user = {};
          $rootScope.$broadcast('auth-error');
        });
    };
  });
