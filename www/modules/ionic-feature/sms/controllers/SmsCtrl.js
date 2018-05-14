"use strict";

var app = angular.module('ng-laravel');
app.controller('SmsCtrl',function($scope,$cordovaSms,$ionicPlatform,$ionicLoading,$rootScope){

    /**
     * Default variable
     */
    $scope.phoneNumber ='';
    $scope.text = '';

    /**
     * Send SMS
     */
    $scope.sendSms = function (phonenumber,text) {
        if(phonenumber === '' || text ===''){
            alert('Please fill your phone number or text message!')
        }else{
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    // intent: 'INTENT'  // send SMS with the native android SMS messaging
                    intent: '' // send SMS without open any other app
                }
            };
            $ionicPlatform.ready(function() {
                $ionicLoading.show($rootScope.loading);
                $cordovaSms
                    .send(phonenumber, text, options)
                    .then(function () {
                        // success. SMS was sent
                        $ionicLoading.hide();
                        $scope.phoneNumber ='';
                        $scope.text = '';
                    }, function (error) {
                        // An error occurred
                        $ionicLoading.hide();
                        alert('An error occurred!');
                    });
            })
        }
    }
});