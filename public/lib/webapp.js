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
'use strict';

/* Controllers */
function MainCtrl($scope, $http, $uibModal, $timeout, $cookies, $cookieStore) {
    $scope.showSplash = function(clickEvent) {
        console.log('showSplash');
        var modalInstance = $uibModal.open({
          templateUrl: 'welcomeSplash.html',
          size: 'lg',
          controller: function ($scope, $uibModalInstance) { 
              $scope.showStartupSplash = !($cookieStore.get('hideStartupSplash') || false);
              $scope.ok = function () {
                $uibModalInstance.close($scope.showStartupSplash);
              }; 
            }
          });      

        modalInstance.result.then(function (val) {
          $cookieStore.put('hideStartupSplash', !val);
        });        
      }

    function showStartup() {
      console.log('showStartup');
          if(!$cookieStore.get('hideStartupSplash')) {
                $scope.showStartupSplash = true;
                $scope.showSplash();
          } else {
                $scope.showStartupSplash = false;
          }          
      }
    
    $timeout(showStartup);

}

function IndexCtrl($scope, $http) {
  $http.get('/api/items').
    success(function(data, status, headers, config) {
      $scope.items = data.items;

      $scope.sortCol = "Name";
      $scope.sortDesc = false;
      $scope.sort = function(col) {
        if ($scope.sortCol == col) {
          $scope.sortDesc = !$scope.sortDesc;
        } else {
          $scope.sortCol = col;
          $scope.sortDesc = false;
        }   
      };
    });
}
IndexCtrl.$inject = ["$scope", "$http"];

function AddItemCtrl($scope, $http, $location) {
  $scope.form = {};
  console.log('additemcontrol ', $scope.form) ;
  $scope.submitItem = function () {
    $http.post('/api/item', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadItemCtrl($scope, $http, $routeParams) {
  $http.get('/api/item/' + $routeParams.id).
    success(function(data) {
      $scope.item = data.item;
    });
}
ReadItemCtrl.$inject = ["$scope", "$http", "$routeParams"];

function EditItemCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.before = {};
  $scope.elements = [];
      
  $http.get('/api/item/' + $routeParams.id).
    success(function(data) {   
      $scope.form = data.item;   
      $scope.before = angular.copy(data.item);
   });

  $scope.editItem = function () {
    if (!angular.equals($scope.before, $scope.form)){
      $scope.form.LastModified = Date.now();
      
      $http.post('/api/item/' + $scope.form.id, $scope.form).
        success(function(data) {
          $location.url('/editItem/' + $scope.form.id);
        });      
    }  
  };
}
EditItemCtrl.$inject = ["$scope", "$http", "$location", "$routeParams"];

function DeleteItemCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/item/' + $routeParams.id).
    success(function(data) {
      $scope.item = data.item;
    });

  $scope.deleteItem = function () {
    $http.delete('/api/item/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}
DeleteItemCtrl.$inject = ["$scope", "$http", "$location", "$routeParams"];
'use strict';

/* Directives */

angular.module('myApp.directives', []).
  	directive('appVersion', ["version", function (version) {
	    return function(scope, elm, attrs) {
	      elm.text(version);
	    };
	}]).
	directive('ngAutoExpand', ["$window", "$timeout", function($window, $timeout) {
		return {
				restrict: 'A',
				link: function(scope, element, attr) {
						element.on('input propertychange', update);
						element.on('click', update);
						
						function update() {
							var scrollTop = $window.pageYOffset,
								scrollLeft = $window.pageXOffset;
							element.css({
								height: 'auto',
								overflow: 'hidden'
							});
							var height = element[0].scrollHeight;
							if (height > 0) {
								element.css('height', height + 'px');
							}
							$window.scrollTo(scrollLeft, scrollTop);
						}
						$timeout(update);
					}
		};
	}])
;

'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ["version", function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');
