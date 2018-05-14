'use strict';

// database instance
var db = null;

app
    .run(function ($ionicPlatform, $rootScope, $stateParams, $state, Restangular, ionicToast, $cordovaNetwork, $cordovaSQLite, $ionicHistory,$ionicPopup) {
        /* API Base url to access to files or image */
        $rootScope.API_URL = 'http://bitacora.aci.edu.co/laravel-backend/public/api/';
        $rootScope.ngLaravelBackEndFileURL = 'http://bitacora.aci.edu.co/laravel-backend/public/uploads/';
        $rootScope.ngLaravelUploadSrv = 'http://bitacora.aci.edu.co/laravel-backend/public/api/uploadimage';
        $rootScope.ngLaravelDeleteImageSrv = 'http://bitacora.aci.edu.co/laravel-backend/public/api/deleteimage/';

        // add listener for change page title and parent menu activation
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // Loading Option
        $rootScope.loading = {
            animation: 'fade-in',
            template: '<ion-spinner icon="android"></ion-spinner>',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        };

        // because my back-end is multilingual, we should set default language
        Restangular.setDefaultRequestParams({lang: 'en-us'});


        // ionic confirm close app with back button
        $ionicPlatform.registerBackButtonAction(function () {
            if ($state.current.name === "login") {
                navigator.app.exitApp();
            }
            else if ($ionicHistory.backView() === null) {
                // confirm popup alert
                $ionicPopup.confirm({
                    title: 'System warning',
                    template: 'Do you want to exit?'
                }).then(function(res) {
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                })
            }
            else {
                $ionicHistory.goBack();
            }
        }, 100);

        // ionic config
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            // check your internet connection
            if ($cordovaNetwork.isOffline()) {
                ionicToast.show('Please check your internet connection and try again.', 'bottom', true, 5000);
            }

            // cordova SQLite setup
            $ionicPlatform.ready(function () {
                db = $cordovaSQLite.openDB({name: "nglaravel.db", location: 'default'});// database file name is 'nglaravel'
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
            });
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $authProvider, RestangularProvider, $ionicConfigProvider) {

        /**
         *
         *  ngAA Config
         */
        $authProvider.signinUrl = 'http://bitacora.aci.edu.co/laravel-backend/public/api/authenticate';
        $authProvider.signinState = 'login';
        $authProvider.signinRoute = '/login';
        $authProvider.signinTemplateUrl = 'shared/views/login.html';
        $authProvider.afterSigninRedirectTo = 'admin.dashboard';
        $authProvider.afterSignoutRedirectTo = 'login';

        /**
         *
         * Restangular API URL
         */
        RestangularProvider.setBaseUrl('http://bitacora.aci.edu.co/laravel-backend/public/api');
        /* force Restangular's getList to work with Laravel 5's pagination object  */
        RestangularProvider.addResponseInterceptor(parseApiResponse);
        function parseApiResponse(data, operation) {
            var response = data;
            if (operation === 'getList' && data.data) {
                response = data.data;
                response.metadata = _.omit(data, 'data');
            }
            return response;
        }


        /**
         * UI-Router config
         */
        // config prefix and unmatched route handler - UI-Router
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go('login');
        });
        $stateProvider
            .state('forget', {
                url: "/forget",
                templateUrl: "shared/views/forget.html"
            })
            .state('reset', {
                url: "/reset",
                templateUrl: "shared/views/reset.html"
            })
            .state('admin', {
                url: '/admin',
                abstract: true,
                data: {
                    authenticated: true
                },
                controller: 'AdminCtrl',
                templateUrl: 'shared/views/admin.html'
            })
            .state('admin.dashboard', {
                url: "/dashboard",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/dashboard.html",
                        controller: 'DashboardCtrl'
                    }
                },
                resolve: {
                    resolvedItems: ['$http','$rootScope',
                    function($http, $rootScope) {
                        return $http({
                            method : "GET",
                            url :  $rootScope.API_URL + "profesores"
                        }).then(function mySucces(response) {
                            return response.data;
                        });
                    }]
                }
            })
            .state('admin.tasks', {
                url: "/tasks",
                views: {
                    'menuContent': {
                        templateUrl: "modules/task/views/tasks.html",
                        controller: 'TaskListCtrl'
                    }
                },
                data: {
                    permits: {
                        withAny: ['view_task', 'delete_task']
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems: ['TaskService',
                        function (TaskService) {
                            return TaskService.cachedList().then(function (data) {
                                return data;
                            });
                        }]
                }
            })
            .state('admin.createTask', {
                url: "/tasks/new",
                views: {
                    'menuContent': {
                        templateUrl: "modules/task/views/taskform.html",
                        controller: 'TaskCreateCtrl'
                    }
                },
                data: {
                    permits: {
                        withOnly: 'add_task'
                    }
                }
            })
            .state('admin.editTask', {
                url: "/tasks/:id/edit",
                views: {
                    'menuContent': {
                        templateUrl: "modules/task/views/taskform.html",
                        controller: 'TaskEditCtrl'
                    }
                },
                data: {
                    permits: {
                        withOnly: 'edit_task'
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems: ['TaskService', '$stateParams',
                        function (TaskService, $stateParams) {
                            return TaskService.show($stateParams.id).then(function (data) {
                                return data;
                            });
                        }],
                    resolvedUsers: ['UserService',
                        function (UserService) {
                            return UserService.list().then(function (data) {
                                return data;
                            });
                        }],
                    resolvedCategories: ['CategoryService',
                        function (CategoryService) {
                            return CategoryService.list().then(function (data) {
                                return data;
                            });
                        }]
                }
            })




            //BITACORA START
            .state('admin.categorias', {
                url: "/categorias",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/categorias.html",
                        controller: 'CategoriasCtrl'
                    }
                },
                cache: false,
                resolve: {
                    
                }
            })

            .state('admin.franjas', {
                url: "/franjas",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/franjas.html",
                        controller: 'FranjasCtrl'
                    }
                },
                cache: false,
                resolve: {
                    
                }
            })

            .state('admin.grupos', {
                url: "/grupos",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/grupos.html",
                        controller: 'GruposCtrl'
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems:['$http','$rootScope',
                    function($http, $rootScope) {
                        return $http({
                            method : "GET",
                            url : $rootScope.API_URL + "cursos"
                        }).then(function mySucces(response) {
                            return response.data;
                        });
                    }]
                }
            })

            .state('admin.gruposDetalle', {
                url: "/grupos-detalle",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/gruposDetalle.html",
                        controller: 'GruposDetalleCtrl'
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems:['$http', '$rootScope',
                    function($http, $rootScope) {
                        return $http({
                            method : "GET",
                            url : $rootScope.API_URL + "cursos/"
                        }).then(function mySucces(response) {
                            return response.data;
                        });
                    }]
                }
            })

            .state('admin.recibos', {
                url: "/recibos",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/recibos.html",
                        controller: 'RecibosCtrl'
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems:['$http', '$rootScope',
                    function($http, $rootScope) {
                        return $http({
                            method : "GET",
                            url : $rootScope.API_URL + "profesores/"
                        }).then(function mySucces(response) {
                            return response.data;
                        });
                    }]
                }
            })

            .state('admin.pagar', {
                url: "/pagar",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/pagar.html",
                        controller: 'PagarCtrl'
                    }
                },
                cache: false,
                resolve: {
                    
                }
            })

            .state('admin.registro', {
                url: "/registro",
                views: {
                    'menuContent': {
                        templateUrl: "shared/views/registro.html",
                        controller: 'RegistroCtrl'
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems:['$http', '$rootScope',
                    function($http, $rootScope) {
                        return $http({
                            method : "GET",
                            url : $rootScope.API_URL + "profesores/"
                        }).then(function mySucces(response) {
                            return response.data;
                        });
                    }]
                }
            })









            //BITACORA END

            .state('admin.categories', {
                url: "/categories",
                views: {
                    'menuContent': {
                        templateUrl: "modules/category/views/categories.html",
                        controller: 'CategoryCtrl'
                    }
                },
                data: {
                    permits: {
                        withAny: ['view_category', 'delete_category', 'add_category', 'edit_category']
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems: ['CategoryService',
                        function (CategoryService) {
                            return CategoryService.cachedList().then(function (data) {
                                return data;
                            });
                        }]
                }
            })
            .state('admin.sqlite', {
                url: "/sqlite",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/sqlite/views/sqlite.html",
                        controller: 'SqliteCtrl'
                    }
                },
                cache: false
            })
            .state('admin.camera', {
                url: "/camera",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/camera/views/camera.html",
                        controller: 'CameraCtrl'
                    }
                },
                cache: false
            })
            .state('admin.barcode', {
                url: "/barcode",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/barcode/views/barcode.html",
                        controller: 'BarcodeCtrl'
                    }
                },
                cache: false
            })
            .state('admin.contact', {
                url: "/contact",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/contact/views/contact.html",
                        controller: 'ContactCtrl'
                    }
                },
                cache: false
            })
            .state('admin.vibration', {
                url: "/vibration",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/vibration/views/vibration.html",
                        controller: 'VibrationCtrl'
                    }
                },
                cache: false
            })
            .state('admin.device', {
                url: "/device",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/device/views/device.html",
                        controller: 'DeviceCtrl'
                    }
                },
                cache: false
            })
            .state('admin.sms', {
                url: "/sms",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/sms/views/sms.html",
                        controller: 'SmsCtrl'
                    }
                },
                cache: false
            })
            .state('admin.push', {
                url: "/push",
                views: {
                    'menuContent': {
                        templateUrl: "modules/ionic-feature/push/views/push.html",
                        controller: 'PushCtrl'
                    }
                },
                cache: false
            })
    });