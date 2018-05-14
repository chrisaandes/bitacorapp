"use strict";

var app = angular.module('ng-laravel');
app.controller('VibrationCtrl',function($scope, $cordovaVibration, $ionicPlatform){
    
    /**
     * Vibrate 1000ms
     */
    $scope.num = 1000;
    
    $scope.vibrate = function (num) {
        $ionicPlatform.ready(function() {
            if (num === 0) {
                $cordovaVibration.vibrate(num);
            } else {
                $cordovaVibration.vibrate(1000);
            }
        });
    }

});