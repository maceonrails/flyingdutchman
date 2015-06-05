'use strict';

var App = angular
  .module('erestoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule'
  ]);

App
  .config(function (localStorageServiceProvider) {
    var domain = window.location.hostname;
        domain = domain === 'localhost' ? '' : domain;
    localStorageServiceProvider
      .setPrefix('eresto')
      .setStorageType('sessionStorage')
      .setStorageCookieDomain(domain);
  });
