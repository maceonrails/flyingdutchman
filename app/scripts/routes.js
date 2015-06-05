'use strict';

App
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $urlRouterProvider.when('', '/dashboard');

    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        template: '<div ui-view></div>',
        controller: function(localStorageService, $state){
          var token = localStorageService.get('token');
          if (token === null){
            $state.go('welcome');
          }
        }
      })
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: 'views/dashboard/index.html',
        })

      .state('welcome', {
        url: '/welcome',
        templateUrl: 'views/auth/index.html'
      });
  });
