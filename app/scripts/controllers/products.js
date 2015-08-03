'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:outletsCtrl
 * @description
 * # outletsCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('ProductsCtrl', function ($scope, $rootScope, Outlet) {
    $scope.products       = {};
    $scope.selected       = {};
    $scope.uploading      = false;
    $scope.formType       = 'new';
    $scope.selectedID     = null;
    $scope.imageError     = false;
    $scope.imageErrorMsg  = null;
    $rootScope.controller = 'products';

    $scope.categories = ['Category 1', 'Category 2'];

    // ng init
    $rootScope.initial = function(xpage){
      var page = xpage || 1;
      Outlet.getData(page)
        .then(
          function(res){
            if (res.products !== undefined) {
              $scope.products = res.products;
              jQuery('.search').removeClass('loading');
              if (res.products.length > 0) {
                $scope.selected   = angular.copy(res.products[0]);
                $scope.formType   = 'existing';
                $scope.selectedID = 0;
              }else {
                $scope.selected   = {};
                $scope.formType   = 'new';
              }
            }
          });
    };

    $rootScope.addNew = function(){
      $scope.selected = {};
      $scope.formType = 'new';
    };

    $scope.selectProduct = function(idx){
      $scope.selected   = angular.copy($scope.products[idx]);
      $scope.selectedID = idx;
      $scope.formType   = 'existing';

      jQuery('label.error').remove();
      jQuery('input.error, select.error, textarea.error').removeClass('error');
    };

    $scope.$watch('files', function () {
      var _file = $scope.files;
      if ( _file && !_file.type.match(/^image\//) ){
        $scope.imageError    = true;
        $scope.imageErrorMsg = 'Only image allowed.';
      } else {
        $scope.imageError    = false;
        $scope.upload($scope.files);
      }
    });

    var _transformToBase64 = function(file, callback){
      var FR= new FileReader();
      FR.onload = callback;
      FR.readAsDataURL( file );
    };

    $scope.upload = function (files) {
      if (files) {
        $scope.uploading = true;
        // jQuery('.xloading').removeClass('hide');
        // jQuery('.holder').addClass('hide');
        // jQuery('.result').addClass('hide');

        var file      = files;
        var name      = file.name.replace(/\.[^/.]+$/, '');
        var asset     = {};
        var extension = (/[.]/.exec(file.name)) ? '.'+/[^.]+$/.exec(file.name)[0] : null;
        angular.extend(asset, $scope.asset, {
          name: name,
          mime: file.type,
          size: file.size,
          status: 0,
          extension:  extension
        });

        _transformToBase64(file, function(e){
          angular.extend(asset, { data: e.target.result });
          console.log(e.target.result)
          // _sendData(asset);
        });
      }
    };

    $scope.saveData = function(){
      if (!$scope.selected.picture){
        $scope.imageError    = true;
        $scope.imageErrorMsg = 'This field is required.';
      }

      var form = jQuery('.entry-form');
      form.validate();
      if (form.valid() && $scope.selected.picture){
        $scope.imageError = false;
        if ($scope.formType === 'new'){
          Outlet.save($scope.selected)
            .then(function(res){
              $scope.outlets.push(res.outlet);
              $scope.selected = angular.copy(res.outlet);
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Outlet.handle422(err.data);
                _removeDimmer();
              }
            });
        }else {
          Outlet.update($scope.selected)
            .then(function(res){
              $scope.outlets[$scope.selectedID] = res.outlet;
              $scope.selected = angular.copy(res.outlet);
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Outlet.handle422(err.data);
                _removeDimmer();
              }
            });
        }
      }
    };

    var _removeDimmer = function(){
      jQuery('.content-workspace > .dimmer').removeClass('active');
    };
  });
