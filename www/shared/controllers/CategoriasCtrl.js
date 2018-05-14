"use strict";

var app = angular.module('ng-laravel');
app.controller('CategoriasCtrl', function ($scope, $auth, $state, $rootScope, $ionicLoading,$cordovaNetwork,ionicToast,$ionicPlatform, $http) {
    
    $scope.init = function() {
        
        $http({
            method : "GET",
            url : $rootScope.API_URL + "categorias"
        }).then(function mySucces(response) {
            $scope.categories = response.data.data;
        });
    }

    $scope.init();

    


});
