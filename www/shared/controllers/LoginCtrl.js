"use strict";

var app = angular.module('ng-laravel');
app.controller('LoginCtrl',function($scope,$rootScope,$ionicLoading,$cordovaDevice,$cordovaVibration,ionicToast,$ionicPlatform,$cordovaNetwork){
    
    $scope.$on('signinBegin', function() {
        // $scope.loader = true;
        $ionicLoading.show({
            animation: 'fade-in',
            template:'<ion-spinner icon="android"></ion-spinner>',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    });

    $scope.$on('signinError', function() {
        // $scope.loader = false;
        $ionicLoading.hide();
    });

    $scope.$on('signinSuccess', function() {
        $ionicLoading.hide();
    })

    




});