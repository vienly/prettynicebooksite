(function(module) {
  var navigation = {};
  var $navButton = $('.nav-toggle-button');
  var $siteWrapper = $('.site-wrap');

  navigation.initNavigation = function() {
    $navButton.on('click', function() {
      $(this).toggleClass('navActive');
      $siteWrapper.toggleClass('navActive');
      console.log($(this).attr('class'));
    });
  };

  module.navigation = navigation;
})(window);
