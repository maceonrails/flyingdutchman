'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:outletsCtrl
 * @description
 * # outletsCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('ProductsCtrl', function ($scope, $rootScope, Product) {
    $scope.products       = {};
    $scope.selected       = {};
    $scope.selected.result= '';
    $scope.formType       = 'new';
    $scope.selectedID     = null;
    $scope.categories     = null;
    $scope.imageError     = false;
    $scope.imageErrorMsg  = null;
    $rootScope.controller = 'products';

    console.log($scope.selected);

    // ng init
    $rootScope.initial = function(xpage){
      var page = xpage || 1;
      Product.getData(page)
        .then(
          function(res){
            if (res.products !== undefined) {
              $scope.products = res.products;
              jQuery('.search').removeClass('loading');
              if (res.products.length > 0) {
                $scope.selected        = angular.copy(res.products[0]);
                $scope.selected.result = '';
                $scope.formType        = 'existing';
                $scope.selectedID      = 0;
              }else {
                $scope.selected   = {};
                $scope.formType   = 'new';
              }
            }
          });
      _getCategories();
    };

    var _getCategories = function(){
      Product.category().then(
        function(res){
          if (res.categories !== undefined){
            $scope.categories = res.categories;
          }
        });
    };

    var _getFileExtension = function(filename){
      return filename.substr(filename.lastIndexOf('.')+1);
    };

    $rootScope.addNew = function(){
      $scope.selected       = {};
      $scope.selected.result= '';
      $scope.formType       = 'new';
    };

    $scope.removePicture = function(){
      $scope.selected.picture_base64 = null;
      $scope.selected.picture        = null;
    };

    $scope.selectProduct = function(idx){
      $scope.selected        = angular.copy($scope.products[idx]);
      $scope.selectedID      = idx;
      $scope.formType        = 'existing';
      $scope.selected.result = '';
      $scope.imageError      = false;

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
        var file      = files;
        angular.extend($scope.selected, {
          picture_extension: _getFileExtension(file.name),
          picture: file.name
        });

        _transformToBase64(file, function(e){
          angular.extend($scope.selected, { picture_base64: e.target.result });
          $scope.$apply();
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
        $scope.imageError              = false;
        $scope.selected.picture_base64 = $scope.selected.result;

        if ($scope.formType === 'new'){
          Product.save($scope.selected)
            .then(function(res){
              $scope.products.push(res.product);
              $scope.selected       = angular.copy(res.product);
              $scope.selected.result= '';
              $scope.formType       = 'existing';
              _getCategories();
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Product.handle422(err.data);
                _removeDimmer();
              }
            });
        }else {
          Product.update($scope.selected)
            .then(function(res){
              $scope.products[$scope.selectedID] = res.product;
              $scope.selected       = angular.copy(res.product);
              $scope.selected.result= '';
              _getCategories();
              _removeDimmer();
            },
            function(err){
              if (err.status === 422){
                Product.handle422(err.data);
                _removeDimmer();
              }
            });
        }
      }
    };

    $scope.deleteData = function(){
      $scope.selected.active = false;

      Product.update($scope.selected)
        .then(function(){
          $scope.products.splice($scope.selectedID, 1);
          if ( $scope.products.length > 0 ){
            $scope.selectedID = 0;
            $scope.selectProduct(0);
          }else {
            $scope.selected       = {};
            $scope.formType       = 'new';
            $scope.selected.result= '';
          }
          _getCategories();
          _removeDimmer();
        },
        function(err){
          if (err.status === 422){
            Product.handle422(err.data);
            _removeDimmer();
          }
        });
    };

    var _removeDimmer = function(){
      jQuery('.content-workspace > .dimmer').removeClass('active');
    };
  });
