/**
 * SpiceSense - regionalController
 * Demonstrates: Tamil Nadu Regional Cuisine Explorer
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('regionalController', ['recipeService', '$routeParams', function(recipeService, $routeParams) {
    var vm = this;

    vm.selectedRegion = $routeParams.region || 'Chettinad';
    vm.regionalRecipes = [];
    vm.isLoading = false;

    vm.regionInfoMap = {
      'Chettinad': {
        title: 'Chettinad (Karaikudi & Sivagangai)',
        description: 'World-renowned for sun-dried spices, hand-pounded masalas, stone flower (Kalpasi), and fiery pepper sukkas.',
        signature: 'Chettinad Chicken Sukka, Kuzhi Paniyaram, Seepu Seedai'
      },
      'Madurai': {
        title: 'Madurai (The Temple & Food City)',
        description: 'Famous for round soft Malkova idlis, street side Kothu Parotta, Kari Dosa, Jigarthanda, and spicy Salna gravy.',
        signature: 'Madurai Idli Sambar, Kothu Parotta, Kari Dosa'
      },
      'Tirunelveli': {
        title: 'Tirunelveli & Thamirabarani Valley',
        description: 'Famous for rich coconut milk wedding stew (Sodhi), wheat halwa cooked in Thamirabarani water, and spicy ginger chutneys.',
        signature: 'Tirunelveli Sodhi, Ulundhu Kali, Halwa'
      },
      'Kongu Nadu': {
        title: 'Kongu Nadu (Erode, Salem, Coimbatore)',
        description: 'Known for rustic farm-to-table vegetarian comfort food, Arisi Paruppu Sadam, Opputtu, and gingelly oil tempering.',
        signature: 'Kongu Arisi Paruppu Sadam, Millet Dosa Wrap'
      },
      'Thanjavur': {
        title: 'Thanjavur (The Rice Bowl of Tamil Nadu)',
        description: 'Famous for royal Chola culinary traditions, Ven Pongal, Poondu Vatha Kuzhambu, Sakkarai Pongal, and brass pot cooking.',
        signature: 'Sakkarai Pongal, Poondu Vatha Kuzhambu, Keerai Kootu'
      },
      'Chennai': {
        title: 'Chennai & Capital Flavors',
        description: 'Hub of crisp Ghee Roast Dosa, Onion Rava Dosa, filter coffee culture, and modern Tamil fusion bowls.',
        signature: 'Ghee Roast Dosa, Rava Dosa, Chettinad Pasta'
      },
      'Coimbatore': {
        title: 'Coimbatore & Nilgiris Foothills',
        description: 'Pioneer of healthy millet gastronomy, ragi dosas, and fresh herb infused curry leaf hummus wraps.',
        signature: 'Millet Dosa Wrap, Thinai Ven Pongal'
      },
      'Nagercoil': {
        title: 'Nagercoil & Kanyakumari Coastal',
        description: 'Infused with Kerala coastal influences, coconut oil drizzled stew, raw coconut cumin paste, and steamed Idiyappam.',
        signature: 'Nagercoil Coconut Kuzhambu, Idiyappam & Sweet Coconut Milk'
      }
    };

    vm.loadRegionRecipes = function(regionName) {
      if (regionName) vm.selectedRegion = regionName;
      vm.isLoading = true;

      recipeService.getAllRecipes({ region: vm.selectedRegion })
        .then(function(data) {
          vm.isLoading = false;
          if (data.success) {
            vm.regionalRecipes = data.recipes;
          }
        })
        .catch(function(err) {
          vm.isLoading = false;
          console.error('Regional recipes error:', err);
        });
    };

    vm.loadRegionRecipes();
  }]);
})();
