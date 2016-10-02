  // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'App.controllers', 'App.services'])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, BackandProvider) {

    BackandProvider.setAppName('cdeapp');
    BackandProvider.setSignUpToken('69d128da-583c-47c8-bd58-131567dfe8c6');
    BackandProvider.setAnonymousToken('f90818f2-06a0-45e0-afa3-8a732b49ccc9');

    $stateProvider

      .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('homeMenu', {
        url: '/homeMenu',
        abstract: true,
        templateUrl: 'templates/menu.html'
      })

      .state('homeMenu.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html'
          }
        }
      })

      .state('homeMenu.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      })

      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
      })

      .state('homeMenu.newsfeed', {
        url: '/newsfeed',
        views: {
          'menuContent': {
            templateUrl: 'templates/newsfeed.html',
            controller: 'NewsfeedCtrl'
          }
        }
      })

      .state('homeMenu.speakers', {
        url: '/speakers',
        views: {
          'menuContent': {
            templateUrl: 'templates/speakers.html',
          }
        }
      })

      .state('homeMenu.map', {
        url: '/map',
        views: {
          'menuContent': {
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('homeMenu.schedule', {
        url: '/schedule',
        views: {
          'menuContent': {
            templateUrl: 'templates/schedule.html'
          }
        }
      })


      .state('homeMenu.profileRaluca', {
        url: '/profileRaluca',
        views: {
          'menuContent': {
            templateUrl: 'templates/profileRaluca.html',
          }
        }
      })

      .state('homeMenu.profileVasu', {
        url: '/profileVasu',
        views: {
          'menuContent': {
            templateUrl: 'templates/profileVasu.html',
          }
        }
      })

      .state('homeMenu.profileLianna', {
        url: '/profileLianna',
        views: {
          'menuContent': {
            templateUrl: 'templates/profileLianna.html',
          }
        }
      })


// if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/welcome');
//$urlRouterProvider.otherwise('/newsfeed');
  });
