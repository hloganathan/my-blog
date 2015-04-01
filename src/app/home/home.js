angular.module('myblog.home', []).config(['$routeProvider', '$locationProvider',
    function($routeProvider,$locationProvider) {
        'use strict';
        $locationProvider.html5Mode(true);
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
            }).when('/login', {
                controller: 'HomeCtrl',
                templateUrl: 'home/login.html'
            }).otherwise({ redirectTo: '/' });
    },

]);
