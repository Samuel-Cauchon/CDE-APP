  // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'App.controllers', 'App.services', 'App.filters'])

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
        templateUrl: 'templates/menu.html',
        controller: 'menuController'
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

      .state('homeMenu.users', {
        url: '/users',
        views: {
          'menuContent': {
            templateUrl: 'templates/users.html',
            controller: 'UsersPageCtrl'
          }
        }
      })

      .state('homeMenu.logout', {
        url: '/logout',
        views: {
          'menuContent': {
            templateUrl: 'templates/logout.html',
            controller: 'LogoutCtrl'
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
	  .state('homeMenu.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })

	  .state('homeMenu.sponsors', {
        url: '/sponsors',
        views: {
          'menuContent': {
            templateUrl: 'templates/popup.html',
          }
        }
      })

    .state('homeMenu.userProfile', {
        url: '/userProfile',
        views: {
          'menuContent': {
            templateUrl: 'templates/userProfile.html',
            controller: 'UserProfileCtrl'
          }
        }
      })

    .state('homeMenu.options', {
        url: '/options',
        views: {
          'menuContent': {
            templateUrl: 'templates/options.html',
            controller: 'OptionCtrl'
          }
        }
      })

// if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/welcome');
  });
