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
    $rootScope.controller = 'Sign in';

    var token = localStorageService.get('token');
    if (token !== null){
      $state.go('app.dashboard');
    }

    $scope.doLogin = function(){
      $scope.signIn = true;
      User.authenticate($scope.user)
        .then(function(response){
          $scope.signIn = false;
          localStorageService.set('token', response.token);
          $timeout(function(){
            $state.go('app.dashboard', { token: response.token });
          }, 200);
        }, function(error){
          $scope.signIn = false;
          $scope.signInError = 'Ups, '+ error.data.message;
        });
    };
  });
