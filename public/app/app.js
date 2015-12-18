'use strict';

var app = angular.module('myApp', ['ui.bootstrap', 'ngRoute', 'ngCookies', 'myApp.filters', 'myApp.services', 'myApp.directives']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/addItem', {
        redirectTo: '/editItem/0'
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
      when('/search', {
        templateUrl: 'partials/search',
        controller: SearchCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }])
  .controller('MainCtrl', ['$scope', '$http', '$uibModal', '$timeout', '$cookies', '$cookieStore', MainCtrl]);
;