"use strict";

var app = angular.module('ng-laravel');
app.controller('ContactCtrl',function($scope,$rootScope,$cordovaContacts, $ionicPlatform,$ionicLoading,$ionicModal){

    /**
     * Default variable
     */
    $scope.contacts = [];
    $ionicModal.fromTemplateUrl('modules/ionic-feature/contact/views/contactform.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    
    /**
    * Create contact form
    */
    $scope.new = function () {
        $scope.contactForm ={};
        $scope.contactForm.phoneNumbers =[];
        $scope.contactForm.phoneNumbers[0] ={};
        $scope.contactForm.phoneNumbers[0].type ='work';
        $scope.modal.show();
    };
    
    
    /**
     * Add contact
     */
    $scope.addContact = function() {
        $ionicPlatform.ready(function() {
            $cordovaContacts.save($scope.contactForm).then(function (result) {
                // Contact saved
                alert('Contact saved');
            }, function (err) {
                alert('Contact doesn\'t save!');
            });
        });
    };

    /**
     * Get All Contacts
     */
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner><br/>Fetch Contacts...'
    });
    $ionicPlatform.ready(function() {
        $cordovaContacts.find({filter: '',multiple:true}).then(function (allContacts) { //omitting parameter to .find() causes all contacts to be returned
            $ionicLoading.hide();
            $scope.contacts = allContacts;
        });
    });



   

});