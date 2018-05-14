"use strict";

var app = angular.module('ng-laravel');
app.controller('DashboardCtrl',function($scope, resolvedItems, $rootScope, $http, $auth, $ionicLoading){
    

        $scope.horario={};
    
        console.log(resolvedItems)
        $scope.profesores = resolvedItems;
        $scope.profile = $auth.getProfile().$$state.value;
    
        
        $scope.profesor = $scope.profesores[0].id.toString()
    
    
        console.log($scope.profile)
        if($scope.profile.permissions.indexOf("view_registro") != -1){
            $scope.profesor = $scope.profile.id.toString();
            $scope.byUser = true;
    
            console.log('ok')
        }

        $scope.loading = function() {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        }

        $scope.loaded = function() {
            $ionicLoading.hide();
        }


        

       
    
         $scope.init = function(profesor) {
            $scope.loading();

            $http({
                method : "GET",
                url : $rootScope.API_URL + "grupos?user=" + profesor
            }).then(function mySucces(response) {
                $scope.loaded();
                $scope.horarios = {}
                $scope.grupos = response.data;
                // $scope.grupo = $scope.grupos[0].id.toString() 
    
                $scope.profesor = profesor
    
                $scope.selectGroup($scope.profesor, 'all')
                
            });
        }
    
    
        $scope.formatDate = function(date) {
            // moment.locale('es')
            return moment(new Date(date)).add(1,'days').format("MMMM dd-DD");
        }
    
         $scope.changeFranja = function(category) {
            $scope.init($scope.franja);
        }
        
        $scope.getItemsFromThePast =  function(item) {
          var today = new Date();
          
    
          return new Date(item.dia) < today;
        }
    
        
    
        $scope.selectGroup = function(profesor,category) {
            $scope.emptyHorarios = false
            $scope.selectedGroup = category;
            $scope.horario.grupo_id = category
    
            $scope.fullCalendarOption = false
            $scope.loading();
            $http({
                method : "GET",
                url : $rootScope.API_URL + "grupo-profesores?grupo=" + category + "&user=" + profesor
            }).then(function mySucces(response) {
    
                var events = []
                var colors = ['aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
    
                if(response.data){
                    $scope.horarios = response.data
                    $scope.emptyHorarios = false
    
    
                    // console.log($scope.horarios)
    
                    var cont = []
                    var contGrupo = []
                    var contiGrupo = 0
    
                    for (var i = 0; i < $scope.horarios.length; i++) {
                        var item = $scope.horarios[i]
                        
                        if(!cont[item.dia])
                            cont[item.dia] = 2
    
                        if(!contGrupo[item.name]){
                            contiGrupo += 1
                            contGrupo[item.name] = contiGrupo
                        }
    
    
    
                        console.log(colors[contGrupo[item.name]])
                        
                        var d = new Date(item.dia + ' ' + '05:00:00');
                        var df = new Date(item.dia + ' ' + '05:00:00');
    
                        d.setHours(d.getHours() + cont[item.dia]);
                        df.setHours(df.getHours() + cont[item.dia] + 1);
    
                        var calendar = {
                            title: item.name + ' <br> ' + item.horas + 'H ' ,
                            // title: item.name + ' <br> ' + item.horas + 'H ' + $scope.formatDate(item.dia),
                            start: d,
                            end: df,
                            allDay: false,
                            color : colors[contGrupo[item.name]]
                        }
    
                        events.push(calendar)
    
                        cont[item.dia] += 1
                    };
                    console.log(events)
    
                }else{
                    $scope.emptyHorarios = true
                    $scope.horarios = []
                }

                $('#calendar').fullCalendar({
                    header: {
                      left: 'prev,next today',
                      center: 'title',
                      right: 'agendaDay,agendaWeek'
                    },
                    defaultView : 'agendaDay',
                    // defaultDate: '2018-03-12',
                    navLinks: true, // can click day/week names to navigate views
                    editable: false,
                    eventLimit: true, // allow "more" link when too many events
                    // events: events,
                    height: 500,
                    eventRender: function (event, element) {
                        element.find('.fc-title').html(event.title);
                    },
                    displayEventTime: false
                });
    
                $('#calendar').fullCalendar( 'removeEvents' );


                $('#calendar').fullCalendar( 'addEventSource', events);    

                $('#calendar').fullCalendar( 'rerenderEvents' );

                $scope.loaded();
                
            });
        }
    
        // custom calendar with ui-jq & ui-options plugin
        $scope.date = new Date();
        $scope.d = $scope.date.getDate();
        $scope.m = $scope.date.getMonth();
        $scope.y = $scope.date.getFullYear();
    
        // custom calendar with ui-jq & ui-options plugin
        
    
    
        $scope.init($scope.profesor);
});
