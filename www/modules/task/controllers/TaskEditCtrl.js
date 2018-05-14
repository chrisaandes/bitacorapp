"use strict";

var app = angular.module('ng-laravel');
app.controller('TaskEditCtrl',function($scope,TaskService,CategoryService,UserService,$http,$rootScope,TagService,$stateParams,$filter,$cordovaCamera,$cordovaImagePicker,$ionicPlatform,$cordovaFileTransfer,ionicToast,resolvedItems,resolvedUsers,resolvedCategories,htmlValidationError){


    /*
     * Define initial value
     */
    $scope.tmp = {};
    $scope.statusList = [{id:0,name:'Open'},{id:1,name:'Close'}];
    $scope.arrayFiles = [];



    /*
     * Edit mode Task
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.task = resolvedItems;
    $scope.task.start_date = new Date(resolvedItems.start_date);
    $scope.task.end_date = new Date(resolvedItems.end_date);
    // use to initial user, category in ion-autocomplete
    $scope.userTemp = $scope.task.user_id;
    $scope.categoryTemp = $scope.task.category_id;
    // convert to arrayFiles object
    angular.forEach($scope.task.gallery,function (value, key) {
        $scope.arrayFiles.push({
            filePath: $rootScope.ngLaravelBackEndFileURL+value.filename,
            progress: 100,
            filename: value.filename, // parse filename from file path
            uploaded: true,
            serverId: value.filename
        });
    });


    /*
     * Get task and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     * Because of ion-autocomplete we couldn't use cache feature
     */
    // TaskService.show($stateParams.id).then(function(data) {
    //     $scope.task = data;
    //     $scope.task.start_date = new Date(data.start_date);
    //     $scope.task.end_date = new Date(data.end_date);
    //     // use to initial user, category in ion-autocomplete
    //     $scope.userTemp = $scope.task.user_id;
    //     $scope.categoryTemp = $scope.task.category_id;
    //     // gallery initial
    //     $scope.arrayFiles = [];
    //     angular.forEach($scope.task.gallery,function (value, key) {
    //         $scope.arrayFiles.push({
    //             filePath: $rootScope.ngLaravelBackEndFileURL+value.filename,
    //             progress: 100,
    //             filename: value.filename, // parse filename from file path
    //             uploaded: true,
    //             serverId: value.filename
    //         });
    //     });
    // });


    /*
     * Update task
     */
    $scope.update = function(task) {
        $scope.isDisabled = true;
        ionicToast.show('Processing...', 'bottom', true,5000);
        TaskService.update(task);
    };


    /*
     * Get all Category
     */
    $scope.categories = resolvedCategories;
    // filter categories
    $scope.searchCategory = function (query) {
        return {
            items:  $filter('filter')($scope.categories, { name: query })
        }
    };
    // ion-autocomplete initial
    $scope.initialCategory = function (modelValue) {
        // filter by id
        var category = $scope.categories.filter(function(obj) {
            return obj.id == modelValue;
        });
        return category[0];
    };



    /*
     * Get all Customers
     */
    $scope.users = resolvedUsers;
    // filter users
    $scope.searchUser = function (query) {
        return {
            items:  $filter('filter')($scope.users, { name: query })
        }
    };
    // ion-autocomplete initial
    $scope.initialUser = function (modelValue) {
        // filter by id
        var user = $scope.users.filter(function( obj ) {
            return obj.id == modelValue;
        });
        return user[0];
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
     * Task event listener related to TaskEditCtrl
     ********************************************************/
    // Update task event listener
    $scope.$on('task.update', function() {
        ionicToast.show('Task updated successfully.', 'bottom', false, 2500);
        $scope.isDisabled = false;
    });
    
    //Validation error in create task event listener
    $scope.$on('task.validationError', function(event,errorData) {
        var htmlError = htmlValidationError.convert(errorData);
        ionicToast.show(htmlError, 'top', true, 5000);
        $scope.isDisabled = false;
    });
});

