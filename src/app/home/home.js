angular.module('myblog.home', []).config(['$routeProvider',
    function($routeProvider) {
        'use strict';
        $routeProvider
            .when('/home', {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.html'
            });
    }
]);

