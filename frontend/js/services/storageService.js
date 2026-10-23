/**
 * SpiceSense - storageService
 * Demonstrates: LocalStorage integration for persistent client state
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('storageService', ['$window', function($window) {
    var STORAGE_KEYS = {
      TOKEN: 'spicesense_jwt_token',
      USER: 'spicesense_user_data',
      RECENTLY_VIEWED: 'spicesense_recently_viewed',
      GUEST_SHOPPING: 'spicesense_guest_shopping'
    };

    return {
      set: function(key, value) {
        $window.localStorage.setItem(key, JSON.stringify(value));
      },

      get: function(key, defaultValue) {
        var item = $window.localStorage.getItem(key);
        if (!item) return defaultValue;
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      },

      remove: function(key) {
        $window.localStorage.removeItem(key);
      },

      // Recently Viewed Helpers
      addRecentlyViewed: function(recipe) {
        if (!recipe || !recipe._id) return;
        var list = this.get(STORAGE_KEYS.RECENTLY_VIEWED, []);
        // Remove duplicate if exists
        list = list.filter(function(r) { return r._id !== recipe._id; });
        // Add to front
        list.unshift({
          _id: recipe._id,
          name: recipe.name,
          region: recipe.region,
          imageUrl: recipe.imageUrl,
          cookTimeMinutes: recipe.cookTimeMinutes,
          viewedAt: new Date()
        });
        // Limit to 6 items
        if (list.length > 6) list.pop();
        this.set(STORAGE_KEYS.RECENTLY_VIEWED, list);
      },

      getRecentlyViewed: function() {
        return this.get(STORAGE_KEYS.RECENTLY_VIEWED, []);
      },

      KEYS: STORAGE_KEYS
    };
  }]);
})();
