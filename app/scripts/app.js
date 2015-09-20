'use strict';
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

var App = angular
  .module('erestoApp', [
    'ngCookies',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule',
    'restangular',
    'angularify.semantic',
    'ngProgress',
    'angularMoment',
    'ngConfirm',
    'autocomplete',
    'ngFileUpload',
    'ngImgCrop',
    'localytics.directives',
    'ngLodash'
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
      .setBaseUrl('http://192.168.1.251/v1');

    $httpProvider.interceptors.push('APIInterceptor');
  })
  .service('APIInterceptor', function($rootScope, localStorageService, $q, $injector) {
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

    service.responseError = function(rejection) {
      if (rejection.status === 401) {
        localStorageService.set('token', null);
        $injector.get('$state').transitionTo('welcome');
        return $q.reject(rejection);// return to login page
      }else {
        return $q.reject(rejection);
      }
    };

    service.response = function(response) {
      var data = response.headers('X-Token');
      if (data){
        localStorageService.set('token', data);
      }

      // set total data
      var total = response.data.total;
      if (total){
        $rootScope.total = total;
      }
      return response;
    };
  })
  .run(function($rootScope, $state, $stateParams, Authenticate, Cancan, ngProgress, $interval) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      ngProgress.start();

      //cancel interval
      if ($rootScope.interval){
        $interval.cancel($rootScope.interval);
      }

      // track the state the user wants to go to; authorization service needs this
      $rootScope.toState       = toState;
      $rootScope.toStateParams = toStateParams;
      // if the principal is resolved, do an authorization check immediately. otherwise,
      // it'll be done when the state it resolved.
      if (Cancan.isIdentityResolved()) {
        Authenticate.authorize();

      }
    });

    $rootScope.$on('$stateChangeSuccess', function(){ ngProgress.complete(); });
    $rootScope.$on('$stateChangeError', function(){ ngProgress.complete(); });
  });
