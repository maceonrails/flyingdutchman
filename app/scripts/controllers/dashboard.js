'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $stateParams) {
    $rootScope.token = $stateParams.token; // set token from params

  });
