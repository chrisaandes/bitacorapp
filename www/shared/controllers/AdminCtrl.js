"use strict";

var app = angular.module('ng-laravel');
app.controller('AdminCtrl', function ($scope, $auth, $state, $rootScope, $ionicLoading,$cordovaNetwork,ionicToast,$ionicPlatform) {
    
    /* Get user profile info */
    $scope.profile = $auth.getProfile().$$state.value;

     /* Search Input & Per Page toggle */
    $scope.searchShow = false;
    $scope.perPageShow = false;

    /******************************************
     * Event actions
     ******************************************/
    /* show loading on page change */
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.resolve) {
            $ionicLoading.show($rootScope.loading);
        }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (toState.resolve) {
            $ionicLoading.hide();
        }
    });

    


});
