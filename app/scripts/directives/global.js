'use strict';
var validateEmail = function(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};

var loginInputSubmit = function(element, step, scope){
  if (step === 'one'){
    // this is email
    var data = element.val();
    if (validateEmail(data)){
      jQuery(element).parent().children(':not(.icons)').toggleClass('hide');
      var icons  = jQuery(element).siblings('.icons');
      var parent = jQuery(element).parent().parent();
      var pwidth = parseInt(parent.css('width'));
      icons.css('left', pwidth + 50 + 'px');

      setTimeout(function() {
        jQuery('.one').toggleClass('hide');
        jQuery('.one').parent().css('width', '250px');
        jQuery('.two').toggleClass('hide');
        jQuery('.two').find('input').focus();
        jQuery(element).parent().children(':not(.icons)').toggleClass('hide');
        icons.css('left', '0px');
      }, 500);
    }else{
      var xparent = element.parent().parent();
      xparent.addClass('animated shake');
      setTimeout(function() { xparent.removeClass('animated shake'); }, 1000);
    }
  }else{
    jQuery(element).parent().children(':not(.icons)').toggleClass('hide');
    var iicons  = jQuery(element).siblings('.icons');
    var iparent = jQuery(element).parent().parent();
    var ipwidth = parseInt(iparent.css('width'));
    iicons.css('left', ipwidth + 50 + 'px');

    setTimeout(function() {
      jQuery('.two').toggleClass('hide');
      jQuery('.two').parent().css('width', '250px');
      jQuery(element).parent().parent().toggleClass('hide');
      jQuery('.three').removeClass('hide');
      jQuery(element).parent().children(':not(.icons)').toggleClass('hide');
      iicons.css('left', '0px');
    }, 10);

    scope.doLogin();
  }
};

App
  .directive('autogrow', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.bind('change keyup paste', function () {
          var parent = element.parent().parent();
          var val    = element.val();

          if (val.length > 9){
            var inputLength  = val.length * 12.2;
            var parentLength = inputLength + 140;
            parent.css('width', parentLength + 'px');
            element.css('width', inputLength + 'px');
          }else {
            parent.css('width',  '250px');
            element.css('width', '108px');
          }
        });
      }
    };
  })
  .directive('step', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('keypress', function (ev) {
          if (ev.keyCode === 13 || ev.keyCode === 9){
            loginInputSubmit(element, attr.step, scope);
          }
        });
      }
    };
  })
  .directive('continue', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.bind('click', function () {
          element.addClass('hide').next().removeClass('hide');
          jQuery('.one').find('input').focus();
        });
      }
    };
  })
  .directive('btnStep', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function () {
          var input = element.before();
          loginInputSubmit(input, attr.btnStep, scope);
        });
      }
    };
  })
  .directive('loginBtn', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        scope.$on('auth-error', function() {
          jQuery(element).addClass('hide');
          var one = jQuery('.one');
          one.parent().removeClass('hide');
          one.removeClass('hide');
          one.find('input').focus();
          setTimeout(function() { one.parent().addClass('animated shake'); }, 100);
          setTimeout(function() { one.parent().removeClass('animated shake'); }, 1100);
        });
      }
    };
  })
  .directive('contentWorkspace', function ($window) {
    return {
      restrict: 'C',
      link: function (scope, element) {
        var lHeight = $window.innerHeight - 100;
        jQuery(element).css('min-height',lHeight +'px');
      }
    };
  })
  .directive('pickaday', function () {
    return {
      restrict: 'C',
      link: function (scope, element) {
        new Pikaday({
          field: jQuery(element)[0],
          format: 'ddd, D MMM YYYY'
        });
      }
    };
  })
  .directive('ngSearch', function($rootScope){
    return {
      restrict: 'A',
      link: function (scope, element) {
        var btn = element.find('.search');
        btn.bind('click', function () {
          btn.addClass('loading');
          jQuery('#search').focus();
          if ($rootScope.search === null || $rootScope.search.field === undefined){
            $rootScope.search = null;
          }
          $rootScope.initial($rootScope.page);
        });
      }
    };
  })
  .directive('sidebar', function(){
      return {
        restrict: 'C',
        link: function (scope, element) {
          jQuery(element).enscroll({
            showOnHover: true,
            verticalTrackClass: 'track3',
            verticalHandleClass: 'handle3'
          });
        }
      };
  })
  .filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
      for (var i=0; i<total; i++){
        input.push(i);
      }
      return input;
    };
  })
  .directive('item', function(Order){
      return {
        restrict: 'C',
        link: function (scope, element) {
          element.bind('click', function(){
            jQuery(element).toggleClass('done');
            var doneList = jQuery(element).siblings('li.item.done').andSelf().length;
            var undoneList = jQuery(element).siblings('li.item').andSelf().length;
            var order_id = jQuery(element).attr('order-id');
            
            Order.updateItemServed(order_id);

            if (doneList===undoneList) {
              console.log('done');
              jQuery(element).closest('.order-container')
                .append('<div class="darken"></div>')
                .children('.btn-done').show();
            }
          });
        }
      };
  })
  .directive('btnDone', function(){
      return {
        restrict: 'C',
        link: function (scope, element) {
          element.bind('click', function(){
            jQuery(element).closest('.order-container').remove();
          });
        }
      };
  });
