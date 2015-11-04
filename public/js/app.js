'use strict';

angular.module('myApp', ['ngRoute', 'myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/addItem', {
        templateUrl: 'partials/addItem',
        controller: AddItemCtrl
      }).
      when('/readItem/:id', {
        templateUrl: 'partials/readItem',
        controller: ReadItemCtrl
      }).
      when('/editItem/:id', {
        templateUrl: 'partials/editItem',
        controller: EditItemCtrl
      }).
      when('/deleteItem/:id', {
        templateUrl: 'partials/deleteItem',
        controller: DeleteItemCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);