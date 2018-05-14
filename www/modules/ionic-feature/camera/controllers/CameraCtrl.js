"use strict";

var app = angular.module('ng-laravel');
app.controller('CameraCtrl',function($scope,$ionicPlatform,$cordovaCamera){
    
    /**
     *  Take picture
     */
    $scope.takePicture = function () {
        $ionicPlatform.ready(function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
    
            $cordovaCamera.getPicture(options).then(function (imageData) {
                // var image = document.getElementById('myImage');
                $scope.imageTake = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                alert(err);
            });
        });
    };
    
    
    
});