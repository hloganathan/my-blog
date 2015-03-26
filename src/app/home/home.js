angular.module('myblog.home', []).config(['$routeProvider', '$locationProvider',
    function($routeProvider,$locationProvider) {
        'use strict';
        $routeProvider
            .when('/home', {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.html'
            }).when('/about', {
                controller: 'HomeCtrl',
                templateUrl: 'home/about.html'
            }).when('/portfolio', {
                controller: 'HomeCtrl',
                templateUrl: 'home/portfolio.html'
            }).when('/contact', {
                controller: 'HomeCtrl',
                templateUrl: 'home/contact.html'
            });
        $locationProvider.html5Mode(true);
    }
]);
