'use strict';

angular.module('erestoApp')
  .factory('Discount', function (Restangular, $rootScope) {
    return {
      getData: function(page) {
        if ($rootScope.search){
          var query = {};
          angular.extend(query, {  page: page }, $rootScope.search);
          return Restangular.one('discounts', 'search').customGET('', query);
        }else{
          return Restangular.all('discounts').customGET('', { page: page });
        }
      },
      save: function(discount) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.all('discounts')
          .customPOST({'discount': discount}, null, {}, {});
      },
      update: function(discount) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.one('discounts', discount.id)
          .customPUT({'discount': discount}, null, {}, {});
      },

      delete: function(discount) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.one('discounts', discount.id).remove();
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
