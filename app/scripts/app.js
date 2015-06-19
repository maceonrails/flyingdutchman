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
  });;
