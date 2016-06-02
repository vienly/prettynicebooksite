(function(module) {
  var bookController = {};
  navigation.initNavigation();

  bookController.index = function() {
    bookView.initIndexPage();
  };

  module.bookController = bookController;
})(window);
