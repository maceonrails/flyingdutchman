'use strict';

/**
 * @ngdoc function
 * @name erestoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the erestoApp
 */
angular.module('erestoApp')
  .controller('MainCtrl',
    function ($rootScope, localStorageService, $state, currentUser, $timeout, $stateParams, Cloud, $q, Restangular) {
      $rootScope.$state        = $state;
      $rootScope.token         = $stateParams.token; // set token from params
      $rootScope.user          = currentUser;
      $rootScope.stateWithList = ['app.restricted.staff', 'app.restricted.products',
                                  'app.restricted.tables', 'app.restricted.discounts'];
      $rootScope.doesntHavePage= ['app.restricted.tables'];

      $rootScope.state         = $state;
      $rootScope.page          = 1;
      $rootScope.controller    = 'default';
      $rootScope.search        = null;
      $rootScope.syncError     = false;
      $rootScope.syncActive    = false;

      $rootScope.countPage = function(){
        return isNaN(Math.ceil($rootScope.total/10)) ? 1 : Math.ceil($rootScope.total/10);
      };

      $rootScope.nextPage = function(){
        if ($rootScope.countPage() > $rootScope.page){
          $rootScope.page += 1;
          $rootScope.initial($rootScope.page);
        }
      };

      $rootScope.prevPage = function(){
        if ($rootScope.page > 1){
          $rootScope.page -= 1;
          $rootScope.initial($rootScope.page);
        }
      };

      var token = localStorageService.get('token');
      if (token === null){
        $state.go('welcome');
      }

      $rootScope.doLogout = function(){
        delete $rootScope.token;
        localStorageService.remove('token');
        $timeout(function () {
          $state.go('welcome');
        }, 100);
      };

      $rootScope.sync = function(){
        jQuery('.ui.modal')
          .modal('setting', 'closable', false)
          .modal('show');
      };

      $rootScope.doSync = function(){
        $rootScope.syncActive = 'downloading';
        var products  = Cloud.one('products', 'all').get();
        var outlet    = Cloud.one('outlets', $rootScope.outlet_id).get();
        var staffs    = Cloud.one('users', 'all')
                          .customGET('', {'filter[outlet_id]': $rootScope.outlet_id});
        var category  = Cloud.one('product_categories', 'all').get();

        $q.all([products, staffs, outlet, category])
          .then(function(results){
            $rootScope.syncActive = 'saving';

            Restangular.all('sync')
              .customPOST(angular.extend(results[0], results[1], results[2], results[3]), null, {}, {})
              .then(function(){
                jQuery('.ui.modal').modal('hide');
                $rootScope.syncActive = false;
                $rootScope.syncError  = false;

                $state.go('app.dashboard');

              }, function(){
                $rootScope.syncError  = true;
                $rootScope.syncActive = false;
              });

          }, function(){
            $rootScope.syncError  = true;
            $rootScope.syncActive = false;
          });

        $rootScope.$watch('outlet_id', function(newVal, oldVal){
          if (newVal !== oldVal){
            $rootScope.syncError  = false;
          }
        });
      };
  });
