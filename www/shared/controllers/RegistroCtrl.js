"use strict";

var app = angular.module('ng-laravel');
// Directives based on http://stackoverflow.com/a/24271309/3894163
app.directive("limitToMax", function() {
    return {
      link: function(scope, element, attributes) {
        element.on("keydown keyup", function(e) {
      if (Number(element.val()) > Number(attributes.max) &&
            e.keyCode != 46 // delete
            &&
            e.keyCode != 8 // backspace
          ) {
            e.preventDefault();
            element.val(attributes.max);
          }
        });
      }
    };
  });
  
  app.directive("preventTypingGreater", function() {
    return {
      link: function(scope, element, attributes) {
        var oldVal = null;
        element.on("keydown keyup", function(e) {
      if (Number(element.val()) > Number(attributes.max) &&
            e.keyCode != 46 // delete
            &&
            e.keyCode != 8 // backspace
          ) {
            e.preventDefault();
            element.val(oldVal);
          } else {
            oldVal = Number(element.val());
          }
        });
      }
    };
  });



app.controller('RegistroCtrl', function ($scope, $auth, $state, $rootScope, $ionicLoading,$cordovaNetwork,ionicToast,$ionicPlatform,resolvedItems, $http) {
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
     /*
     * Define initial value
     */
    $scope.grupo={};
    $scope.hora={};
    $scope.horario={};

    console.log(resolvedItems)
    $scope.profesores = resolvedItems;
    $scope.profile = $auth.getProfile().$$state.value;

    
    $scope.profesor = $scope.profesores[0].id.toString()


    console.log($scope.profile)
    if($scope.profile.permissions.indexOf("view_registro") != -1){
        $scope.profesor = $scope.profile.id.toString();
        $scope.byUser = true;

        console.log('ok')
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
            url : $rootScope.API_URL +  "grupos?user=" + profesor
        }).then(function mySucces(response) {
            $scope.loaded();
            $scope.horarios = {}
            $scope.grupos = response.data;
            $scope.grupo = $scope.grupos[0].id.toString() 

            $scope.profesor = profesor

            $scope.selectGroup($scope.grupo)

            
        });
    }



    $scope.changeFranja = function(category) {
        $scope.init($scope.franja);
    }
    
    $scope.getItemsFromThePast =  function(item) {
      var today = new Date();
      

      return new Date(item.dia) < today;
    }

    

    $scope.selectGroup = function(category) {
        $scope.emptyHorarios = false
        $scope.selectedGroup = category;
        $scope.horario.grupo_id = category


        $scope.loading();
        $http({
            method : "GET",
            url : $rootScope.API_URL +  "horarios?grupo=" + category
        }).then(function mySucces(response) {
            $scope.loaded();
            if(response.data){
                $scope.horarios = response.data
                $scope.emptyHorarios = false

            }else{
                $scope.emptyHorarios = true
                $scope.horarios = []
            }

            
            
        });
    }

    $scope.registrar = function() {
        
        $scope.horarioValidation = false
        if(!$scope.hora.id){
            $scope.horarioValidation = true;
            return false;
        }


        $scope.horasValidation = false
        if(!$scope.hora.horas){
            $scope.horasValidation = true;
            return false;
        }

        $scope.asistValidation = false
        if(!$scope.hora.asistencia){
            $scope.asistValidation = true;
            return false;
        }

        $scope.obsValidation = false
        if(!$scope.hora.observacion){
            $scope.obsValidation = true;
            return false;
        }

        $scope.isSaving = true;
        $scope.loading();
        $http({
            method : "PUT",
            url : $rootScope.API_URL +  "add-horas/" + $scope.hora.id,
            data : {
                'horas' : $scope.hora.horas,
                'asistencia' :  $scope.hora.asistencia,
                'observacion' :  $scope.hora.observacion,
                'user_id' :  $scope.profesor
            }
        }).then(function mySucces(response) {
            $scope.loaded();
            $scope.isSaving = false;               
            $scope.registrarHora = false
            $scope.hora={};
            $scope.selectGroup($scope.horarios.grupo_id)
           
        });
    };

    $scope.update = function() {
        $scope.horarioValidation = false
        if(!$scope.hora.id){
            $scope.horarioValidation = true;
            return false;
        }


        $scope.horasValidation = false
        if(!$scope.hora.horas){
            $scope.horasValidation = true;
            return false;
        }

        $scope.asistValidation = false
        if(!$scope.hora.asistencia){
            $scope.asistValidation = true;
            return false;
        }

        $scope.obsValidation = false
        if(!$scope.hora.observacion){
            $scope.obsValidation = true;
            return false;
        }


        $scope.loading();

        $http({
            method : "PUT",
            url : $rootScope.API_URL +  "update-horas/" + $scope.hora.id,
            data : {
                'horas' : $scope.hora.horas,
                'asistencia' :  $scope.hora.asistencia,
                'observacion' :  $scope.hora.observacion,
                'user_id' :  $scope.profesor
            }
        }).then(function mySucces(response) {
            
            $scope.registrarHora = false
            $scope.hora={};
            $scope.selectGroup($scope.horarios.grupo_id)

            $scope.loaded();
        });
    };

    $scope.editHora = function(category) {
        $scope.toggle();
        $scope.registrarHora = true
        // $scope.edit = true
        $scope.hora = category

        $scope.hora.id = category.id.toString();

    };

    $scope.toggle = function toggle() { 
        $scope.edit = !$scope.edit;  
    
        console.log('Status is ' + $scope.edit); 
    };

    $scope.cancelForm = function cancelForm() { 
        $scope.registrarHora=false;
        $scope.hora = {};
        $scope.toggle();
    };

    $scope.showRegistrar = function showRegistart() { 
        $scope.registrarHora=true
    };

    


    

    $scope.updateHora = function() {
        $http({
           method : "PUT",
           url : $rootScope.API_URL +  "horas/" + $scope.hora.id,
           data : $scope.hora
       }).then(function mySucces(response) {
           $scope.toggle();
           $scope.registrarHora = false
           $scope.selectGroup(r$scope.horarios.grupo_id)
       });
   };

    $scope.deleteHora = function(category) {
        var r = confirm("Are you sure?");
        if (r == true) {
           
        } else {
            return false;
        }
        
       
            return  $http({
                    method : "PUT",
                    url : $rootScope.API_URL +  "remove-horas/" + category.id,
                    data : {
                        //'horas' : null,
                        'asistencia' :  null,
                        'observacion' :  null,
                        'user_id' :  null
                    }
                }).then(function mySucces(response) {
                    
                    $scope.registrarHora = false
                    $scope.hora={};
                    $scope.selectGroup($scope.horarios.grupo_id)
                });
       
    };


    $scope.init($scope.profesor);





    


});
