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
    $rootScope.controller = 'login';
    var token = localStorageService.get('token');
    if (token !== null){
      $state.go('app.dashboard');
    }

    $scope.doLogin = function(){
          User.authenticate($scope.user)
            .then(function(response){
              if (response.role === 'superadmin' || response.role === 'owner'){
                localStorageService.set('token', response.token);
                $timeout(function(){
                  $state.go('app.dashboard', { token: response.token });
                }, 200);
              }else{
                $scope.signInError = 'Only superadmin and owner can use this application.';
              }

            }, function(res){
              var message = res.data.message === 'User parameter is required' ? 'Email and password cannot be blank' : res.data.message;
              $scope.signInError = 'Oops, ' + message;
            });
        };
  });
