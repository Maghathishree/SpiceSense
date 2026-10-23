/**
 * SpiceSense - Main AngularJS Application Module
 * Demonstrates: AngularJS Modules, Dependency Injection, RootScope Global State,
 *               Route Guards via $routeChangeStart
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp', [
    'ngRoute',
    'ngAnimate'
  ])
  .run(['$rootScope', '$location', 'authService', 'storageService', function($rootScope, $location, authService, storageService) {
    console.log('🌶️ SpiceSense AngularJS App Initialized!');

    $rootScope.appName = 'SpiceSense';
    $rootScope.appTagline = 'Smart South Indian Recipe & Nutrition Assistant';
    $rootScope.currentUser = authService.getUser();
    $rootScope.isLoggedIn = authService.isLoggedIn();

    // ── Route Guard: redirect unauthenticated users to login ──────────────
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      // Check if the destination route requires authentication
      var requiresAuth = next && next.data && next.data.requiresAuth;

      if (requiresAuth && !authService.isLoggedIn()) {
        event.preventDefault();

        // Remember the attempted path so we can redirect after login
        var intendedPath = $location.path() || '/';
        $location.path('/login').search({ redirect: intendedPath });
      }
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current) {
      if (current && current.$$route) {
        $rootScope.currentPath = current.$$route.originalPath;
        if ($rootScope.currentPath === '/dashboard') {
          document.title = 'Dashboard - SpiceSense';
        } else if ($rootScope.currentPath === '/login') {
          document.title = 'Login - SpiceSense';
        } else {
          document.title = 'SpiceSense – Smart South Indian Recipe & Nutrition Assistant';
        }
        // Sync auth state on every route change
        $rootScope.currentUser = authService.getUser();
        $rootScope.isLoggedIn = authService.isLoggedIn();
      }
    });

    $rootScope.logout = function() {
      authService.logout();
      $rootScope.currentUser = null;
      $rootScope.isLoggedIn = false;
      $location.path('/');
    };
  }]);
})();
