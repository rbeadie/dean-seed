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