'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, User, Outlet, Printer) {
    $scope.printers   = [];
    $scope.this_user  = angular.copy($rootScope.user);
    $scope.addPrinter = false;
    $rootScope.controller = 'settings';
    $scope.newprinter = {};

    Outlet.getData(1).then(function(res){
      $scope.outlet = res.outlets[0];
    });

    var _reloadPrinters = function(){
      Printer.getData().then(function(res){
        $scope.printers = res.printers;
        jQuery('.dimmer.printer').removeClass('active');
      }, function(){
        jQuery('.dimmer.printer').removeClass('active');
      });
    };

    _reloadPrinters();

    $scope.updateUser = function(){
      jQuery('.dimmer.user').addClass('active');
      User.update($scope.this_user).then(function(){jQuery('.dimmer.user').removeClass('active');},
        function(){jQuery('.dimmer.user').removeClass('active');});
    };

    $scope.updateOutlet = function(){
      jQuery('.dimmer.outlet').addClass('active');
      Outlet.update($scope.outlet).then(function(){jQuery('.dimmer.outlet').removeClass('active');},
        function(){jQuery('.dimmer.outlet').removeClass('active');});
    };

    var reset_printer = function(){
      jQuery('#newprinter-name').val('');
      jQuery('#newprinter-printer').val('');
      jQuery('#newprinter-default').prop('checked', false);
    };

    $scope.cancelAddPrinter = function(){
      jQuery('#addPrinter').addClass('ng-hide');
    };

    $scope.showAddPrinter = function(){
      jQuery('#addPrinter').removeClass('ng-hide');
    };

    $scope.savePrinter = function(){
      var printer = { name: jQuery('#newprinter-name').val(), printer: jQuery('#newprinter-printer').val(), default: jQuery('#newprinter-default').is(':checked') };
      Printer.save(printer).then(function(){
        jQuery('.dimmer.printer').removeClass('active');
        _reloadPrinters();
        reset_printer();
        $scope.cancelAddPrinter();
      }, function(){
        jQuery('.dimmer.printer').removeClass('active');
      });
    };

    $scope.deletePrinter = function(printer){
      Printer.delete(printer).then(function(){
        jQuery('.dimmer.printer').removeClass('active');
        _reloadPrinters();
        reset_printer();
        $scope.cancelAddPrinter();
      }, function(){
        jQuery('.dimmer.printer').removeClass('active');
      });
    };

  });
