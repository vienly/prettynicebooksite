(function(module) {
  var bookController = {};

  bookController.index = function() {
    bookView.initIndexPage();
    navigation.initNavigation();
  };

  module.bookController = bookController;
})(window);
