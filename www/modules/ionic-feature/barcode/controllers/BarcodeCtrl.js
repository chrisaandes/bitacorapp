"use strict";

var app = angular.module('ng-laravel');
app.controller('BarcodeCtrl',function($scope,$ionicPlatform,$cordovaBarcodeScanner){

    /**
     * Scan Barcode
     */
    $scope.barcodeScan = function () {
        $ionicPlatform.ready(function () {
            $cordovaBarcodeScanner
                .scan()
                .then(function (barcodeData) {
                    // Success! Barcode data is here
                    $scope.barcode = barcodeData;
                }, function (error) {
                    // An error occurred
                    alert(error);
                });
        });
    };


});