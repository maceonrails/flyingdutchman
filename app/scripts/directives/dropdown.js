/* jshint ignore:start */
'use strict';

angular.module('angularify.semantic.dropdown', [])
  .controller('DropDownController', ['$scope',
    function($scope) {
      $scope.options = [];

      this.add_option = function(title, value){
        $scope.options.push({'title': title, 'value': value});
        if (value == $scope.model){
          this.update_title(value)
        };
      };

      this.remove_option = function(title, value){
        for (var index in $scope.options)
          if ($scope.options[index].value == value &&
            $scope.options[index].title == title){

            $scope.options.splice(index, 1);
            // Remove only one item
            break;
          };
      };

      this.update_model = function (title, value) {
        if ($scope.model !== value)
          $scope.model = value;
      };

      this.update_title = function (value) {
        var changed = false;

        for (var index in $scope.options)
          if ($scope.options[index].value == value){
            $scope.title = $scope.options[index].title;
            changed = true;
          }

        if (changed){
          $scope.text_class = 'text';
        } else{
          $scope.title = value;
          $scope.text_class = 'text';
        }
      };

    }
  ])

.directive('dropdown', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'DropDownController',
    scope: {
      title: '@',
      open: '@',
      model: '=ngModel'
    },
    template: '<div class="{{ dropdown_class }}">' +
      '<div class="{{text_class}}">{{ title }}</div>' +
      '<i class="dropdown icon"></i>' +
      '<div class="{{ menu_class }}"  ng-transclude>' +
      '</div>' +
      '</div>',
    link: function(scope, element, attrs, DropDownController) {
      scope.dropdown_class = 'ui selection dropdown';
      scope.menu_class = 'menu transition hidden';
      scope.text_class = 'default text';
      scope.original_title = scope.title;

      if (scope.open === 'true') {
        scope.is_open = true;
        scope.dropdown_class = scope.dropdown_class + ' active visible';
        scope.menu_class = scope.menu_class + ' visible';
      } else {
        scope.is_open = false;
      }

      scope.toTitleCase = function(str){
          return str.replace('_',' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      };

      /*
       * Watch for ng-model changing
       */
      scope.element = element;
      scope.$watch('model', function (value) {
        // update title or reset the original title if its empty
        var _title = ''; 
        if (value !== undefined && $('.item.'+value).children()[0] !== undefined){
          _title = $('.item.'+value).children()[0].innerHTML;
        }else {
          _title = jQuery(element).attr('title');
        }
        DropDownController.update_title(_title);
      });

      /*
       * Click handler
       */
      element.bind('click', function() {
        if (scope.is_open === false) {
          scope.$apply(function() {
            scope.dropdown_class = 'ui selection dropdown active visible';
            scope.menu_class = 'menu transition visible';
          });
        } else {
          scope.$apply(function() {
            scope.dropdown_class = 'ui selection dropdown';
            scope.menu_class = 'menu transition hidden';
          });
        }
        scope.is_open = !scope.is_open;
      });
    }
  };
})

.directive('dropdownGroup', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    require: '^dropdown',
    scope: {
      title: '=title',
      value: '=value'
    },
    template: '<div class="item {{item_value}}" ng-transclude>{{ item_title }}</div>',
    link: function(scope, element, attrs, DropDownController) {

      // Check if title= was set... if not take the contents of the dropdown-group tag
      // title= is for dynamic variables from something like ng-repeat {{variable}}
      if (scope.title === undefined) {
        scope.item_title = element.children()[0].innerHTML;
      } else {
        scope.item_title = scope.title;
      }
      if (scope.value === undefined) {
        scope.item_value = attrs.value || scope.item_title;
      } else {
        scope.item_value = scope.value;
      }

      // Keep this option
      DropDownController.add_option(scope.item_title, scope.item_value);

      //
      // Menu item click handler
      //
      element.bind('click', function() {
        DropDownController.update_model(scope.item_title, scope.item_value);
        DropDownController.update_title($(this).children()[0].innerHTML);
      });

      scope.$on('$destroy', function(){
        DropDownController.remove_option(scope.item_title, scope.item_value);
      });

    }
  };
});

/* jshint ignore:end */