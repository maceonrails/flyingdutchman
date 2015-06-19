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
        params: { token: null },
        resolve: {
          currentUser: function(Cancan){
            return Cancan.identity();
          }
        }
      })
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: 'views/dashboard/index.html',
          controller: 'DashboardCtrl'
        })

        .state('app.restricted', {
          url: '/',
          abstract: true,
          resolve: {
            authorize: function(Authenticate) {
              return Authenticate.authorize();
            }
          },
          templateUrl: 'views/layouts/application.html'
        })
          .state('app.restricted.users', {
            url: 'users',
            data: {
              roles: ['eresto']
            },
            templateUrl: 'views/dashboard/index.html'
          })


      .state('welcome', {
        url: '/welcome',
        templateUrl: 'views/auth/index.html',
        controller: 'AuthCtrl'
      });
  });
