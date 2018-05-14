"use strict";

var app = angular.module('ng-laravel');
app.controller('DeviceCtrl',function($scope,$cordovaDevice,$ionicPlatform){

    /**
     * Default Variable 
     */
    $scope.info = {};
    
    /**
     * Get Device Info
     */
    $ionicPlatform.ready(function() {
        $scope.info = {
            device : $cordovaDevice.getDevice(),
            cordova : $cordovaDevice.getCordova(),
            model : $cordovaDevice.getModel(),
            platform : $cordovaDevice.getPlatform(),
            uuid : $cordovaDevice.getUUID(),
            version : $cordovaDevice.getVersion()
        }
    });
});