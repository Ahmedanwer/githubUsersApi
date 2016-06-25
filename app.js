var app = angular.module('gitHubApp', ['ui.router']);
var users=[];

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/home', '/');
    $urlRouterProvider.when('/about/', '/about');
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partial-home.html',
             data : { pageTitle: 'Home' }
        })
        .state('about', {
            url: '/about',
            templateUrl: 'partial-about.html',
             data : { pageTitle: 'about' }
        })
        .state('users', {
            url: '/users',
            data : { pageTitle: 'users' },
            views:{
                '': {
                templateUrl: 'partial-users.html',
                controller: 'userController'
              },
                'contact@users': {
                    templateUrl: 'partial-users-detail.html',
                    controller:'userController'
                 },
            }
        })
        .state('users.detail', {
            url: '/{userId}',
            data : { pageTitle: 'Details ' },
            views:{
                  'contact@users': {
                        templateUrl: 'partial-users-detail.html',
                        controller: function($scope,$http,$stateParams,$state) {
                            $scope.currentUser={};
                          $http.get("https://api.github.com/users/"+$stateParams.userId)
                          .then(function(response) {
                                $scope.currentUser=response.data;
                          },function(response){
                            $state.go('users');
                          });
                        }
                }
            },

        });
});
app.controller('userController',function($scope, $http) {
      $scope.users=[];
      $scope.since={};

      $scope.getMoreUsers=function(){
          console.log($scope.since);
        $http.get("https://api.github.com/users?since="+$scope.since)
        .then(function(response) {
          console.log(response.data);

         $scope.users= $scope.users.concat(response.data);
          $scope.since=$scope.users[$scope.users.length-1].id
         });

      }

      $http.get("https://api.github.com/users")
      .then(function(response) {
       $scope.users = response.data;
        $scope.since=$scope.users[$scope.users.length-1].id

          $scope.currentUser=$scope.users[0];
          $http.get("https://api.github.com/users/"+$scope.users[0].login)
          .then(function(response) {
                $scope.currentUser=response.data;
          });

       });
     });


app.directive('updateTitle', ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    return {
      link: function(scope, element) {

        var listener = function(event, toState) {

          var title = 'Default Title';
          if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;

          $timeout(function() {
            element.text(title);
          }, 0, false);
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
]);
