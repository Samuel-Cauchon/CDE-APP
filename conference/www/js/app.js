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

      .state('welcomefr', {
        url: '/welcomefr',
        templateUrl: 'templates/loginfr.html',
        controller: 'LoginCtrl'
      })

      .state('homeMenu', {
        url: '/homeMenu',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'menuController'
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

      .state('homeMenu.profilefr', {
        url: '/profilefr',
        views: {
          'menuContent': {
            templateUrl: 'templates/profilefr.html',
            controller: 'ProfileCtrl'
          }
        }
      })

      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
      })

      .state('registerfr', {
        url: '/registerfr',
        templateUrl: 'templates/registerfr.html',
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

      .state('homeMenu.newsfeedfr', {
        url: '/newsfeedfr',
        views: {
          'menuContent': {
            templateUrl: 'templates/newsfeedfr.html',
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

      .state('homeMenu.usersPage', {
        url: '/usersPage',
        views: {
          'menuContent': {
            templateUrl: 'templates/usersPage.html',
            controller: 'UsersPageCtrl'
          }
        }
      })

      .state('homeMenu.usersPagefr', {
        url: '/usersPagefr',
        views: {
          'menuContent': {
            templateUrl: 'templates/usersPagefr.html',
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

      .state('homeMenu.logoutfr', {
        url: '/logoutfr',
        views: {
          'menuContent': {
            templateUrl: 'templates/logoutfr.html',
            controller: 'LogoutCtrl'
          }
        }
      })

      // .state('homeMenu.map', {
      //   url: '/map',
      //   views: {
      //     'menuContent': {
      //       templateUrl: 'templates/map.html',
      //       controller: 'MapCtrl'
      //     }
      //   }
      // })

      .state('homeMenu.schedule', {
        url: '/schedule',
        views: {
          'menuContent': {
            templateUrl: 'templates/schedule.html',
            controller: 'EventsCtrl'
          }
        }
      })

      .state('homeMenu.schedulefr', {
        url: '/schedulefr',
        views: {
          'menuContent': {
            templateUrl: 'templates/schedulefr.html',
            controller: 'EventsCtrl'
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

    .state('homeMenu.searchfr', {
        url: '/searchfr',
        views: {
          'menuContent': {
            templateUrl: 'templates/searchfr.html',
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

    .state('homeMenu.sponsorsfr', {
        url: '/sponsorsfr',
        views: {
          'menuContent': {
            templateUrl: 'templates/popupfr.html',
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

    .state('homeMenu.userProfilefr', {
        url: '/userProfilefr',
        views: {
          'menuContent': {
            templateUrl: 'templates/userProfilefr.html',
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
