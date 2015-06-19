'use strict';

App
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $urlRouterProvider.when('', '/dashboard');

    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        templateUrl: 'views/layouts/application.html',
        controller: 'MainCtrl',
        params: { token: null }
      })
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: 'views/dashboard/index.html',
          controller: 'DashboardCtrl'
        })

      .state('welcome', {
        url: '/welcome',
        templateUrl: 'views/auth/index.html',
        controller: 'AuthCtrl'
      });
  });
