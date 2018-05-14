"use strict";

var app = angular.module('ng-laravel');
app.controller('RecibosCtrl', function ($scope, $auth, $state, $rootScope, $ionicLoading,$cordovaNetwork,ionicToast,$ionicPlatform, resolvedItems, $http) {
    
    /*
     * Define initial value
     */
    $scope.grupo={};
    $scope.hora={};
    $scope.horario={};
    
    
    $scope.toggle=[];
    $scope.horasRecibo = [];

    console.log(resolvedItems)
    $scope.profesores = resolvedItems;


    $scope.profesor = $scope.profesores[0].id.toString()
    $scope.profile = $auth.getProfile().$$state.value;

    console.log($scope.profile.permissions)

    if($scope.profile.permissions.indexOf("view_recibos") != -1){
        $scope.profesor = $scope.profile.id.toString();
        $scope.byUser = true;

        console.log('ok')
    }

    $scope.loading = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }

    $scope.loaded = function() {
        $ionicLoading.hide();
    }


    $scope.formatDate = function(date) {
        // moment.locale('es')
        return moment(new Date(date)).add(1,'days').format("MMMM dd-DD");
    }
    
    /*
     * Get all categories
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.categories = [];
    //$scope.pagination = $scope.categories.metadata;
    //$scope.maxSize = 5;


    /*
     * Get all category and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     */

    $scope.init = function(profesor) {
        $scope.loading();
        $http({
            method : "GET",
            url : $rootScope.API_URL + "recibos?user=" + profesor
        }).then(function mySucces(response) {
            $scope.recibos = response.data;
            console.log($scope.recibos)
            //$scope.grupo = $scope.grupos[0].id.toString()

            //$scope.selectGroup($scope.grupo)
            $scope.loaded();
        });
    }


    $scope.changeFranja = function(category) {
        $scope.init($scope.franja);
    }

    $scope.selectRecibo = function(category, index) {
        $scope.emptyHorarios = false
        $scope.selectedGroup = category;
        $scope.horario.grupo_id = category

        $scope.loading();
        $http({
            method : "GET",
            url : $rootScope.API_URL + "recibo?recibo=" + category
        }).then(function mySucces(response) {
            $scope.loaded();

            console.log($scope.toggle)
           $scope.toggle[index] = !$scope.toggle[index]

            $scope.horasRecibo[index] = response.data

            $scope.showHoras = true
           
        });
    }

    $scope.init($scope.profesor);

    


});
