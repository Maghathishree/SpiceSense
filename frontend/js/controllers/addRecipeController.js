/**
 * SpiceSense - addRecipeController
 * Handles adding new recipes and editing existing community recipes created by user.
 * Demonstrates: Form validation, two-way data binding, dynamic list manipulation, REST API integration
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('addRecipeController', [
    '$scope',
    '$routeParams',
    '$location',
    'recipeService',
    'authService',
    function($scope, $routeParams, $location, recipeService, authService) {

      // Ensure user is logged in
      if (!authService.isLoggedIn()) {
        $location.path('/auth').search({ redirect: '/add-recipe' });
        return;
      }

      $scope.currentUser = authService.getUser();
      $scope.isEditMode = !!$routeParams.id;
      $scope.recipeId = $routeParams.id || null;
      $scope.loading = false;
      $scope.saving = false;
      $scope.errorMessage = '';
      $scope.successMessage = '';

      // Available options
      $scope.categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Sweets', 'Fusion', 'Regional'];
      $scope.regions = ['Chettinad', 'Madurai', 'Tirunelveli', 'Kongu Nadu', 'Thanjavur', 'Chennai', 'Coimbatore', 'Nagercoil', 'All Tamil Nadu'];
      $scope.classifications = ['Traditional', 'Modern', 'Fusion'];
      $scope.mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
      $scope.difficulties = ['Easy', 'Medium', 'Hard'];
      $scope.availableDietaryTags = ['Vegetarian', 'Vegan', 'High-Protein', 'Gluten-Free', 'Diabetic-Friendly'];

      // Recipe Model
      $scope.recipe = {
        name: '',
        tamilName: '',
        description: '',
        category: 'Lunch',
        region: 'Madurai',
        classification: 'Traditional',
        mealType: 'Lunch',
        isTraditional: true,
        servings: 4,
        prepTimeMinutes: 15,
        cookTimeMinutes: 25,
        difficulty: 'Medium',
        spiceLevel: 2,
        estimatedCostINR: 120,
        imageUrl: '',
        paatiTip: '',
        modernVariation: '',
        dietaryTags: ['Vegetarian'],
        ingredients: [
          { name: '', quantity: 1, unit: 'tbsp', category: 'Spices', isOptional: false }
        ],
        instructions: [
          { stepNumber: 1, instruction: '' }
        ]
      };

      // If in edit mode, fetch existing recipe
      if ($scope.isEditMode) {
        $scope.loading = true;
        recipeService.getRecipeById($scope.recipeId)
          .then(function(data) {
            $scope.loading = false;
            if (data.success && data.recipe) {
              var r = data.recipe;

              // Check ownership
              var ownerId = r.createdBy ? (r.createdBy._id || r.createdBy) : null;
              var currentUserId = $scope.currentUser ? ($scope.currentUser.id || $scope.currentUser._id) : null;

              if (!ownerId || String(ownerId) !== String(currentUserId)) {
                $scope.errorMessage = 'You are not authorized to edit this recipe. You can only edit recipes you created.';
                return;
              }

              $scope.recipe = {
                name: r.name || '',
                tamilName: r.tamilName || '',
                description: r.description || '',
                category: r.category || 'Lunch',
                region: r.region || 'Madurai',
                classification: r.classification || (r.isTraditional ? 'Traditional' : 'Modern'),
                mealType: r.mealType || 'Lunch',
                isTraditional: r.isTraditional !== undefined ? r.isTraditional : true,
                servings: r.servings || 4,
                prepTimeMinutes: r.prepTimeMinutes || 15,
                cookTimeMinutes: r.cookTimeMinutes || 25,
                difficulty: r.difficulty || 'Medium',
                spiceLevel: r.spiceLevel || 2,
                estimatedCostINR: r.estimatedCostINR || 100,
                imageUrl: r.imageUrl || '',
                paatiTip: r.paatiTip || '',
                modernVariation: r.modernVariation || '',
                dietaryTags: r.dietaryTags || ['Vegetarian'],
                ingredients: r.ingredients && r.ingredients.length > 0 ? angular.copy(r.ingredients) : [
                  { name: '', quantity: 1, unit: 'tbsp', category: 'Spices', isOptional: false }
                ],
                instructions: r.instructions && r.instructions.length > 0 ? angular.copy(r.instructions) : [
                  { stepNumber: 1, instruction: '' }
                ]
              };
            } else {
              $scope.errorMessage = 'Recipe not found.';
            }
          })
          .catch(function(err) {
            $scope.loading = false;
            $scope.errorMessage = (err.data && err.data.message) || 'Error loading recipe for editing.';
          });
      }

      // Add/Remove Instructions
      $scope.addInstruction = function() {
        $scope.recipe.instructions.push({
          stepNumber: $scope.recipe.instructions.length + 1,
          instruction: ''
        });
      };

      $scope.removeInstruction = function(index) {
        if ($scope.recipe.instructions.length > 1) {
          $scope.recipe.instructions.splice(index, 1);
          // Re-index step numbers
          $scope.recipe.instructions.forEach(function(step, idx) {
            step.stepNumber = idx + 1;
          });
        }
      };

      // Toggle dietary tag
      $scope.toggleDietaryTag = function(tag) {
        var idx = $scope.recipe.dietaryTags.indexOf(tag);
        if (idx > -1) {
          $scope.recipe.dietaryTags.splice(idx, 1);
        } else {
          $scope.recipe.dietaryTags.push(tag);
        }
      };

      $scope.hasDietaryTag = function(tag) {
        return $scope.recipe.dietaryTags.indexOf(tag) > -1;
      };

      // On Classification change, sync isTraditional
      $scope.onClassificationChange = function() {
        $scope.recipe.isTraditional = ($scope.recipe.classification === 'Traditional');
      };

      // Form validation & Submission
      $scope.submitRecipe = function(form) {
        $scope.errorMessage = '';
        $scope.successMessage = '';

        if (!form.$valid) {
          $scope.errorMessage = 'Please complete all required fields correctly.';
          return;
        }

        // Validate ingredients
        if (!$scope.recipe.ingredients || $scope.recipe.ingredients.length === 0) {
          $scope.errorMessage = 'Please provide at least one ingredient.';
          return;
        }

        for (var i = 0; i < $scope.recipe.ingredients.length; i++) {
          var ing = $scope.recipe.ingredients[i];
          if (!ing.name || !ing.name.trim()) {
            $scope.errorMessage = 'Ingredient #' + (i + 1) + ' must have a valid name.';
            return;
          }
          if (!ing.quantity || Number(ing.quantity) <= 0) {
            $scope.errorMessage = 'Ingredient "' + ing.name + '" must have a quantity greater than 0.';
            return;
          }
        }

        // Validate instructions
        if (!$scope.recipe.instructions || $scope.recipe.instructions.length === 0) {
          $scope.errorMessage = 'Please provide at least one instruction step.';
          return;
        }

        for (var j = 0; j < $scope.recipe.instructions.length; j++) {
          var step = $scope.recipe.instructions[j];
          if (!step.instruction || !step.instruction.trim()) {
            $scope.errorMessage = 'Instruction step #' + (j + 1) + ' cannot be empty.';
            return;
          }
        }

        $scope.saving = true;

        var payload = angular.copy($scope.recipe);
        payload.isTraditional = (payload.classification === 'Traditional');

        var actionPromise = $scope.isEditMode
          ? recipeService.updateRecipe($scope.recipeId, payload)
          : recipeService.createRecipe(payload);

        actionPromise
          .then(function(res) {
            $scope.saving = false;
            $scope.successMessage = $scope.isEditMode ? 'Recipe updated successfully!' : 'Recipe published to Community Kitchen!';
            setTimeout(function() {
              $location.path('/community-kitchen');
              $scope.$apply();
            }, 1200);
          })
          .catch(function(err) {
            $scope.saving = false;
            $scope.errorMessage = (err.data && err.data.message) || 'Failed to save recipe. Please check your inputs.';
          });
      };
    }
  ]);
})();
