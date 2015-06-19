'use strict';

var App = angular
  .module('erestoApp', [
    'ngAnimate',
    'ngCookies',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule',
    'restangular'
  ]);

App
  .config(function (localStorageServiceProvider, RestangularProvider, $httpProvider) {
    var domain = window.location.hostname;
        domain = domain === 'localhost' ? '' : domain;
    localStorageServiceProvider
      .setPrefix('eresto')
      .setStorageType('sessionStorage')
      .setStorageCookieDomain(domain);

    RestangularProvider
      .setBaseUrl('http://localhost:3000/v1');

    $httpProvider.interceptors.push('APIInterceptor');
  })
  .service('APIInterceptor', function($rootScope, localStorageService, $q) {
    var service = this;

    service.request = function(config) {
      if(!config.params) {
        config.params = {};
      }
      var token   = null;
      if ($rootScope.token === null || $rootScope.token === undefined){
        token = localStorageService.get('token');
      }else {
        token = $rootScope.token;
      }

      config.params.token = token;
      return config || $q.when(config);
    };

    service.response = function(response) {
      var data = response.data.token;
      if (data){
        localStorageService.set('token', data);
      }
      return response;
    };
  })
  .run(function($rootScope, $state, $stateParams, Authenticate, Cancan) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      // track the state the user wants to go to; authorization service needs this
      $rootScope.toState       = toState;
      $rootScope.toStateParams = toStateParams;
      // if the principal is resolved, do an authorization check immediately. otherwise,
      // it'll be done when the state it resolved.
      if (Cancan.isIdentityResolved()) {
        Authenticate.authorize();
      }
    });
  });
