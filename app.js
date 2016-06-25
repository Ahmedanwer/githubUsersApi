var app = angular.module('gitHubApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

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
                controller: function($scope, $http,$state) {
                      $scope.users={};
                      $http.get("https://api.github.com/users")
                      .then(function(response) {
                       $scope.users = response.data;
                       });
                     }
              },
                'contact@users': {
                    templateUrl: 'partial-users-detail.html',
                    controller: function($scope,$http,$stateParams) {
                       $scope.currentUser={};
                       $http.get("https://api.github.com/users/"+1)
                       .then(function(response) {
                           $scope.currentUser = response.data;
                       });
                   }
                 },
            }
        })
        .state('users.detail', {
            url: '/{userId}',
            data : { pageTitle: 'detail' },
            views:{
                  'contact@users': {
                        templateUrl: 'partial-users-detail.html',
                        controller: function($scope,$http,$stateParams) {
                           $scope.currentUser={};
                           $http.get("https://api.github.com/users/"+$stateParams.userId)
                           .then(function(response) {
                               $scope.currentUser = response.data;
                           });
                       }
                }
            },

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
