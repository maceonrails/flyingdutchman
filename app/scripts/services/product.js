'use strict';

angular.module('erestoApp')
  .factory('Product', function (Restangular, $rootScope) {
    return {
      getData: function(page) {
        if ($rootScope.search){
          var query = {};
          angular.extend(query, {  page: page }, $rootScope.search);
          return Restangular.one('products', 'search').customGET('', query);
        }else{
          return Restangular.all('products').customGET('', { page: page });
        }
      },

      category: function() {
        return Restangular.one('products', 'category').get();
      },

      save: function(product) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.all('products')
          .customPOST({'product': product}, null, {}, {});
      },
      update: function(product) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.one('products', product.id)
          .customPUT({'product': product}, null, {}, {});
      },
      handle422: function(errors){
        for (var error in errors){
          var title = error.charAt(0).toUpperCase() + error.slice(1);
          jQuery('#'+error)
            .after('<label class="error">' + title + ' ' + errors[error][0] + '</label>');
        }
        return true;
      }
    };
  });
