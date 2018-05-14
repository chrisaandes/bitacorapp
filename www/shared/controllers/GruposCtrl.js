"use strict";

var app = angular.module('ng-laravel');
app.controller('GruposCtrl', function ($scope, $auth,resolvedItems, $state, $rootScope, $ionicLoading,$cordovaNetwork,ionicToast, $http) {
    
    $scope.grupo={};
    $scope.horario={};
    $scope.horario.dias = "LMWJV";
    $scope.viewDetail = false

    console.log(resolvedItems)
    
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



    $scope.initCats = function() {
        $scope.horarios = []
        $scope.loading();
        $http({
            method : "GET",
            url : $rootScope.API_URL +"categorias"
        }).then(function mySucces(response) {
            $scope.loaded();
            $scope.categoriesA = response.data.data;

            if($scope.categoriesA[0]){
                $scope.categoria_id = $scope.categoriesA[0].id.toString() 
                $scope.initFran($scope.categoria_id)

                // $scope.emptyHorarios = true
                
            }

            
        });
    }

    $scope.initCats();

    
    $scope.initFran = function(categoria) {
        $scope.horarios = []
        $scope.loading();
        $http({
            method : "GET",
            url : $rootScope.API_URL +"cursos?categoria=" + categoria
        }).then(function mySucces(response) {
            $scope.loaded();
            $scope.franjas = response.data;

            if($scope.franjas[0]){
                $scope.franja = $scope.franjas[0].id.toString() 
                $scope.init($scope.franja); 

                // $scope.emptyHorarios = true
                
            }

            
        });

    }   

    $scope.changeCat = function(categoria_id) {
        $scope.initFran(categoria_id);
    }


    $scope.init = function(franja) {
        $scope.loading();
        $http({
            method : "GET",
            url : $rootScope.API_URL + "grupos?franja=" + franja
        }).then(function mySucces(response) {
            $scope.loaded();
            $scope.categories = response.data;
            
        });
    }

    $scope.formatDate = function(date) {
        // moment.locale('es')
        return moment(new Date(date)).add(1,'days').format("MMMM dd-DD");
    }


    $scope.changeFranja = function(franja) {
        $scope.init(franja);
    }


    $scope.hideGrupos = function hideGrupos() {
        $scope.viewDetail=false
    }

    $scope.selectGroup = function(category) {
        $scope.emptyHorarios = false
        
        $scope.selectedGroup = category;
        $scope.horario.grupo_id = category
        $scope.loading();
        $http({
            method : "GET",
            url : $rootScope.API_URL + "horarios?grupo=" + category
        }).then(function mySucces(response) {
            $scope.loaded();
            if(response.data.horas){
                $scope.horarios = response.data
                $scope.emptyHorarios = false

            }else{
                $scope.emptyHorarios = true
                $scope.horarios = []
            }

            $scope.viewDetail=true;
           
        });
    }

    


});
