
angular.module('myBlogApp', [
  'ngRoute','ngResource',
  'myBlogApp.home',
  'myBlogApp.todo'
])
.config(['$routeProvider',
        function($routeProvider) {
            'use strict';
            //Default route
            $routeProvider.otherwise({
                redirectTo: '/home'
            });
        }
    ]);