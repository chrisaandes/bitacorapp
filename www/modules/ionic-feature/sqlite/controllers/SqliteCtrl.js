"use strict";

var app = angular.module('ng-laravel');
app.controller('SqliteCtrl',function($scope,$cordovaSQLite,ionicToast) {

    /**
     * Instantiate database file/connection after ionic platform is ready.
     * in .run section in config.router.js we defined DATABASE & TABLES
     */
    $scope.user = {};
    $scope.result = [];


    /**
     * Save in table
     */
    $scope.save = function(user) {
        if(user.firstname || user.lastname){
            var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
            $cordovaSQLite.execute(db, query, [user.firstname, user.lastname])
                .then(function(result) {
                    $scope.load();
                    ionicToast.show("Person saved successful with ID:"+ result.insertId, 'bottom', false, 2500);
                    $scope.user = {};
                }, function(error) {
                    alert("Error on saving: " + error.message);
                })
        } else{
            ionicToast.show("First or Last Name is required!", 'bottom', false, 5000);
        }
    };


    /**
     * Fetch from database
     */
    $scope.load = function() {
        // Execute SELECT statement to load message from database.
        var query = "SELECT * FROM people";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
                $scope.result =[];
                for(var i = 0; i < res.rows.length; i++){
                        $scope.result.push({
                            id: res.rows.item(i).id,
                            firstname: res.rows.item(i).firstname,
                            lastname: res.rows.item(i).lastname
                        });
                }
            } else{
                $scope.result =[];
            }
        }, function (err) {
            console.error(err);
        });
    };


    /**
     * Fetch from database at first
     */
    $scope.load();


    /**
     * Delete record
     */
    $scope.delete = function(id) {
        var query = "DELETE FROM people WHERE id = ?";
        $cordovaSQLite.execute(db, query, [id] )
            .then(
                function (res) {
                    $scope.load();
                    ionicToast.show("Person removed successfully", 'bottom', false, 2500);
                },
                function (err) {
                    alert("Error occurred!");
                })
    }

});