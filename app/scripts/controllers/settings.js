'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, User) {
    $scope.printers   = [];
    $scope.this_user  = angular.copy($rootScope.user);
    $rootScope.controller = 'settings';

    $scope.updateUser = function(){
      jQuery('.dimmer.user').addClass('active');
      User.update($scope.this_user).then(function(){jQuery('.dimmer.user').removeClass('active');},
        function(){jQuery('.dimmer.user').removeClass('active');});
    };

  });
