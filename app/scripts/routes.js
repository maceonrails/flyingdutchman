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
            return Cancan.identity(true);
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
          template: '<div ui-view> </div>'
        })
          .state('app.restricted.users', {
            url: 'users',
            data: {
              roles: ['eresto']
            },
            templateUrl: 'views/users/index.html',
            controller: 'UsersCtrl'
          })

          .state('app.restricted.outlets', {
            url: 'outlets',
            data: {
              roles: ['superadmin', 'owner']
            },
            templateUrl: 'views/outlets/index.html',
            controller: 'OutletsCtrl'
          })

          .state('app.restricted.staff', {
            url: 'staff',
            data: {
              roles: ['superadmin', 'owner']
            },
            templateUrl: 'views/staffs/index.html',
            controller: 'StaffCtrl'
          })

          .state('app.restricted.products', {
            url: 'products',
            data: {
              roles: ['superadmin', 'owner']
            },
            templateUrl: 'views/products/index.html',
            controller: 'ProductsCtrl'
          })

          .state('app.restricted.discounts', {
            url: 'discounts',
            data: {
              roles: ['superadmin', 'owner']
            },
            templateUrl: 'views/discounts/index.html',
            controller: 'DiscountsCtrl'
          })

          .state('app.restricted.settings', {
            url: 'settings',
            data: {
              roles: ['superadmin', 'owner']
            },
            templateUrl: 'views/settings/index.html',
            controller: 'SettingsCtrl'
          })

          .state('app.restricted.orders', {
            url: 'orders',
            data: {
              roles: ['superadmin', 'owner']
            },
            templateUrl: 'views/orders/index.html',
            controller: 'OrdersCtrl'
          })


      .state('welcome', {
        url: '/welcome',
        templateUrl: 'views/auth/index.html',
        controller: 'AuthCtrl'
      });
  });
