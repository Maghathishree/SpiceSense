/**
 * SpiceSense - authController
 * Demonstrates: AngularJS Forms, Input Validation, AuthService & JWT handling
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('authController', ['authService', '$rootScope', '$location', '$routeParams', function(authService, $rootScope, $location, $routeParams) {
    var vm = this;

    vm.loginData = { email: '', password: '' };
    vm.registerData = { username: '', email: '', password: '', confirmPassword: '' };

    vm.errorMessage = '';
    vm.isSubmitting = false;

    // Capture redirect path from query string (set by route guard)
    var redirectPath = $location.search().redirect || '/dashboard';

    vm.login = function() {
      if (!vm.loginData.email || !vm.loginData.password) {
        vm.errorMessage = 'Please enter both email and password';
        return;
      }

      vm.isSubmitting = true;
      vm.errorMessage = '';

      authService.login(vm.loginData)
        .then(function(res) {
          vm.isSubmitting = false;
          if (res.success) {
            $rootScope.currentUser = res.user;
            $rootScope.isLoggedIn = true;
            $location.path(redirectPath).search({});
          } else {
            vm.errorMessage = res.message || 'Login failed';
          }
        })
        .catch(function(err) {
          vm.isSubmitting = false;
          vm.errorMessage = err.data ? err.data.message : 'Invalid email or password';
        });
    };

    vm.register = function() {
      if (!vm.registerData.username || !vm.registerData.email || !vm.registerData.password) {
        vm.errorMessage = 'Please fill out all required fields';
        return;
      }

      if (vm.registerData.password !== vm.registerData.confirmPassword) {
        vm.errorMessage = 'Passwords do not match';
        return;
      }

      vm.isSubmitting = true;
      vm.errorMessage = '';

      authService.register({
        username: vm.registerData.username,
        email: vm.registerData.email,
        password: vm.registerData.password
      })
      .then(function(res) {
        vm.isSubmitting = false;
        if (res.success) {
          $rootScope.currentUser = res.user;
          $rootScope.isLoggedIn = true;
          $location.path('/dashboard');
        } else {
          vm.errorMessage = res.message || 'Registration failed';
        }
      })
      .catch(function(err) {
        vm.isSubmitting = false;
        vm.errorMessage = err.data ? err.data.message : 'Error registering user';
      });
    };
  }]);
})();
