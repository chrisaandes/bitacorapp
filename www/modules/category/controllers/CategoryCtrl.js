"use strict";

var app = angular.module('ng-laravel');
app.controller('CategoryCtrl',function($scope,CategoryService,Restangular,$rootScope,resolvedItems,ionicToast,$ionicLoading,$ionicPopup,$ionicModal,$ionicPopover, htmlValidationError){

    /*
     * Define initial value
     */
    $scope.category={};
    $ionicModal.fromTemplateUrl('modules/category/views/categoriesform.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $ionicPopover.fromTemplateUrl('popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    

    /*
     * Get all categories
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.categories = resolvedItems;
    //$scope.pagination = $scope.categories.metadata;
    //$scope.maxSize = 5;


    /*
     * Get all category and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     */
    CategoryService.list().then(function(data){
        $scope.categories = data;
    });

    /*
     * Create category
     */
    $scope.new = function () {
        $scope.category = {};
        $scope.modal.show();
    };

    /*
     * Create a category
     */
    $scope.create = function(category) {
        $scope.isDisabled = true;
        ionicToast.show('Processing...', 'bottom', true,5000);
        CategoryService.create(category);
    };


    /*
     * Remove selected customers
     */
    $scope.delete = function(category) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Remove file permanently'
        });
        confirmPopup.then(function(res) {
            if(res) {
                ionicToast.show('Processing...', 'bottom', true,5000);
                CategoryService.delete(category);
            }
        });
    };

    /*
     * Edit mode category - Copy category to edit form
     */
    $scope.edit = function(category) {
        var categoryCopy = Restangular.copy(category);
        $scope.modal.show();
        $rootScope.$broadcast('category.edit', categoryCopy);
    };


    /*
     * Update category
     */
    $scope.update = function(category) {
        $scope.isDisabled = true;
        ionicToast.show('Processing...', 'bottom', true,5000);
        CategoryService.update(category);
    };


    /**********************************************************
     * Event Listener
     ***********************************************************/
    // Create category event listener
    $scope.$on('category.create', function() {
        CategoryService.list().then(function(data){
            $scope.modal.hide();
            $scope.categories = data;
            $scope.category={};
            ionicToast.show('Category added successfully.', 'bottom', false, 2500);
            $scope.isDisabled = false;
        });
    });

    //Validation error in create category event listener
    $scope.$on('category.validationError', function(event,errorData) {
        var htmlError = htmlValidationError.convert(errorData);
        ionicToast.show(htmlError, 'middle', true, 5000);
        $scope.isDisabled = false;
    });

    // update list when category deleted
    $scope.$on('category.delete', function() {
        ionicToast.show('Record removed!', 'bottom', false, 2500);
        CategoryService.list().then(function(data){
            $scope.categories =data;
            $scope.selection=[];
        });
    });

    // update list when category not deleted
    $scope.$on('category.not.delete', function() {
        ionicToast.show('Record doesn\'t removed!', 'bottom', false, 2500);
        CategoryService.list().then(function(data){
            $scope.categories =data;
            $scope.selection=[];
        });
    });

    // copy category to form for update
    $scope.$on('category.edit', function(scope, category) {
        $scope.category = category;
        $scope.updateMode= true;
    });

    // // Update category event listener
    $scope.$on('category.update', function() {
        ionicToast.show('Category updated successfully.', 'bottom', false, 2500);
        $scope.modal.hide();
        $scope.isDisabled = false;
        $scope.category={};
        CategoryService.list().then(function(data){
            $scope.categories = data;
        })
    });
});