"use strict";

var app = angular.module('ng-laravel');
app.controller('TaskCreateCtrl',function($scope,TaskService,CategoryService,UserService,$http,$rootScope,TagService,$filter,$cordovaCamera,$cordovaImagePicker,$ionicPlatform,$cordovaFileTransfer,ionicToast,htmlValidationError){


    /*
     * Define initial value
     */
    $scope.tmp = {};
    $scope.task={};
    $scope.task.gallery=[];
    $scope.arrayFiles = [];
    $scope.statusList = [{id:0,name:'Open'},{id:1,name:'Close'}];
    



    /*
     * Create a task
     */
    $scope.create = function(task) {
        $scope.isDisabled = true;
        ionicToast.show('Processing...', 'bottom', true,5000);
        $scope.tmpTask = angular.isObject(task) ? angular.toJson(task) : task;
        TaskService.create($scope.tmpTask);
    };


    /*
     * Get all Category
     */
    CategoryService.list().then(function(data){
        $scope.categories = data;
    });
    // filter categories
    $scope.searchCategory = function (query) {
        return {
            items:  $filter('filter')($scope.categories, { name: query })
        }
    };


    /*
     * Get all Customers
     */
    UserService.list().then(function(data){
        $scope.users = data;
    });
    // filter users
    $scope.searchUser = function (query) {
        return {
            items:  $filter('filter')($scope.users, { name: query })
        }
    };



    /*
     * Get all Tags
     */
    TagService.list().then(function(data){
        $scope.tags = data;
    });
    // filter users
    $scope.searchTag = function (query) {
        return {
            items:  $filter('filter')($scope.tags, { tag: query })
        }
    };


    /*
     * Select Picture
     */
    $scope.selectPicture = function () {
        console.log('console log test by yep');
         var options = {
            maximumImagesCount: 6
            // width: 800,
            // height: 800,
            // quality: 80
        };
        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
                // convert to object
                for (var i = 0; i < results.length; i++) {
                    $scope.arrayFiles.push({
                        filePath: results[i],
                        progress: 0,
                        filename: results[i].replace(/^.*[\\\/]/, ''), // parse filename from file path
                        uploaded: false,
                        serverId: ''
                    });
                }

                // upload image to server
                angular.forEach($scope.arrayFiles, function (value, key) {
                    // if before that file uploaded, no need to upload again
                    if(value.uploaded === false) {
                        $ionicPlatform.ready(function () {
                            // upload file to server
                            $cordovaFileTransfer.upload($rootScope.ngLaravelUploadSrv, value.filePath, {})
                                .then(function (data) {
                                    //convert string to object with remove backslash
                                    var tmp = angular.fromJson(data.response.replace(/\\/g, ""));
                                    $scope.task.gallery.push({filename:tmp.filename,size:tmp.size});
                                    value.serverId = tmp.filename;
                                    value.uploaded = true;
                                }, function (err) {
                                    alert('Error during file upload!');
                                }, function (progress) {
                                    value.progress = (progress.loaded / progress.total) * 100;
                                });
                        })
                    }
                })
            }, function(err) {
                alert('Error during file selection!');
            });
    };
    
    
    /*
     * Remove uploaded file 
     */
     $scope.removeFile = function (serverId) {
         if($scope.task.gallery.length > 0) {
             ionicToast.show('Processing...', 'bottom', true,5000);
             $http({
                 method: "POST",
                 url: $rootScope.ngLaravelDeleteImageSrv + serverId
             }).then(function mySuccess(response) {
                 ionicToast.show('Record removed!', 'bottom', false, 2500);
                 removeByAttr($scope.task.gallery, serverId);
                 // remove file from arrayFiles (view) with filter
                 $scope.arrayFiles = $scope.arrayFiles.filter(function (obj) {
                     return obj.serverId !== serverId;
                 })
             });
         }
     };
    
    // remove array object by attribute value
    var removeByAttr = function(arr, value){
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].filename && arr[i].filename === value) {
                arr.splice(i, 1);
                break;
            }
        }
    };
    
    
    
    /********************************************************
     * Event Listeners
     * Task event listener related to TaskCreateCtrl
     ********************************************************/
    // Create task event listener
    $scope.$on('task.create', function() {
        $scope.task ={};
        $scope.task.gallery =[];
        $scope.task.tags =[];
        $scope.arrayFiles =[];
        ionicToast.show('Task added successfully.', 'bottom', false, 2500);
        $scope.isDisabled = false;
    });

    //Validation error in create task event listener
    $scope.$on('task.validationError', function(event,errorData) {
        var htmlError = htmlValidationError.convert(errorData);
        ionicToast.show(htmlError, 'top', true, 5000);
        $scope.isDisabled = false;
    });

});