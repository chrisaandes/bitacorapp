"use strict";

var app = angular.module('ng-laravel');
app.controller('TaskListCtrl', function ($scope, TaskService, resolvedItems,$rootScope,ionicToast,$ionicLoading,$ionicPopup,$ionicPopover) {
    

    /*
     * Define initial value
     */
    $scope.query = '';
    $ionicPopover.fromTemplateUrl('popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.toggleSearch = function() {
        $scope.searchShow = $scope.searchShow === false ? true: false;
    };

    /*
     * Get all Tasks
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.tasks = resolvedItems;
    $scope.pagination = $scope.tasks.metadata;
    $scope.maxSize = 5;


    /*
     * Get all Task and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     */
    TaskService.list().then(function (data) {
        $scope.tasks = data;
        $scope.pagination = $scope.tasks.metadata;
    });


    /*
     * Remove selected tasks
     */
    $scope.delete = function (task) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Remove file permanently'
        });
        confirmPopup.then(function(res) {
            if(res) {
                ionicToast.show('Processing...', 'bottom', true,5000);
                TaskService.delete(task);
            }
        });
    };


    /*
     * Pagination task list
     */
    $scope.perPage = 10;
    $scope.pageChanged = function () {
        TaskService.pageChange($scope.pagination.current_page + 1, $scope.perPage).then(function (data) {
            angular.forEach(data,function (value, key) {
                $scope.tasks.push(value)
            });
            $scope.pagination = data.metadata;
        });
    };


    /*
     * Search in tasks
     */
    $scope.search = function (query) {
        $ionicLoading.show($rootScope.loading);
        TaskService.search(query, $scope.perPage).then(function (data) {
            $scope.tasks = data;
            $scope.pagination = $scope.tasks.metadata;
            $ionicLoading.hide();
        });
    };
    
    
    // /**********************************************************
    //  * Event Listener
    //  **********************************************************/
        // Get list of selected task to do actions
    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(taskId) {
        // toggle selection for a given task by Id
        var idx = $scope.selection.indexOf(taskId);
        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.selection.push(taskId);
        }
    };

    // update list when task deleted
    $scope.$on('task.delete', function () {
        ionicToast.show('Record removed! Refreshing...', 'bottom', false, 3500);
        TaskService.list().then(function (data) {
            $scope.tasks = data;
            $scope.selection = [];
        });
    });

    // update list when task not deleted
    $scope.$on('task.not.delete', function () {
        ionicToast.show('Record doesn\'t removed!', 'bottom', false, 2500);
        TaskService.list().then(function (data) {
            $scope.tasks = data;
            $scope.selection = [];
        });
    });


});
