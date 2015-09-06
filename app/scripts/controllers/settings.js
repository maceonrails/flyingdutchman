'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, User, localStorageService, $state, $timeout) {
    $scope.user = $rootScope.user;
    console.log($scope.user);

  });
