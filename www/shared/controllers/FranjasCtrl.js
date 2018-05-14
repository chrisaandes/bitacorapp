"use strict";

var app = angular.module('ng-laravel');
app.controller('FranjasCtrl', function ($scope, $auth, $state, $rootScope, $ionicLoading,$cordovaNetwork,ionicToast,$ionicPlatform, $http) {

    $scope.initCats = function() {
        
        $http({
            method : "GET",
            url : $rootScope.API_URL + "categorias"
        }).then(function mySucces(response) {
            $scope.categoriesA = response.data.data;

            if($scope.categoriesA[0]){
                $scope.categoria_id = $scope.categoriesA[0].id.toString() 
                $scope.init($scope.categoria_id)
            }
        });
    }

    $scope.initCats();

    
    $scope.init = function(categoria) {

        $http({
            method : "GET",
            url : $rootScope.API_URL + "cursos?categoria=" + categoria
        }).then(function mySucces(response) {
            $scope.categories = response.data;
        });

    }   

    $scope.changeCat = function(categoria_id) {
        $scope.init(categoria_id);
    }
    
    $http({
        method : "GET",
        url : $rootScope.API_URL + "cursos"
    }).then(function mySucces(response) {
        $scope.categories = response.data;
    });
 

    


});
