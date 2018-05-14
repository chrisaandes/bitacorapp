"use strict";

var app = angular.module('ng-laravel');
app.controller('PushCtrl',function($scope,$cordovaLocalNotification, $ionicPlatform){

    /**
     * Instant Notification
     */
    $scope.scheduleInstantNotification = function () {
        $cordovaLocalNotification.schedule({
            id: 1,
            text: 'Instant Notification',
            title: 'Instant',
            badge: 23,
            icon: 'res://drawable/logo.png'
        }).then(function () {
            console.log("Instant Notification set");
        });
    };

    /**
     * Notification X Seconds from Now
     */
    $scope.scheduleNotificationFiveSecondsFromNow = function () {
        var now = new Date().getTime();
        var _5SecondsFromNow = new Date(now + 5000);
        $cordovaLocalNotification.schedule({
            id: 2,
            date: _5SecondsFromNow,
            text: 'Notification After 5 Seconds Has Been Triggered',
            title: 'After 5 Seconds',
            icon: 'res://drawable/logo.png'
        }).then(function () {
            console.log("Notification After 5 seconds set");
        });
    };


    /**
     * Notification Every Minute
     */
    $scope.scheduleEveryMinuteNotification = function () {
        $cordovaLocalNotification.schedule({
            id: 3,
            title: 'Every Minute',
            text: 'Give a real message',
            every: 'minute',
            icon: 'res://drawable/logo.png'
        }).then(function (result) {
            console.log('Every Minute Notification Set');
        });
    };


    /**
     * Update Notification Text
     */
    $scope.updateNotificationText = function () {
        $cordovaLocalNotification.isPresent(3).then(function (present) {
            if (present) {

                $cordovaLocalNotification.update({
                    id: 3,
                    title: 'Notificaton  Update',
                    text: 'Notification Update Details',
                    icon: 'res://drawable/logo.png'
                }).then(function (result) {
                    console.log('Updated Notification Text');
                });
            } else {
                alert("Must Schedule Every Minute First");
            }
        });
    };


    /**
     * Cancel Notification
     */
    $scope.cancelNotification = function () {
        $cordovaLocalNotification.isPresent(3).then(function (present) {
            if (present) {
                $cordovaLocalNotification.cancel(3).then(function (result) {
                    console.log('Notification EveryMinute Cancelled');
                    alert('Cancelled Every Minute');
                });
            } else {
                alert("Must Schedule Every Minute First");
            }
        });
    };



});