
angular.module('myblog', [
  'ngRoute','ngResource',
  'myblog.home',
  'myblog.todo'
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