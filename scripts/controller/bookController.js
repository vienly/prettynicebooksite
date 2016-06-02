(function(module) {
  var bookController = {};

  bookController.index = function() {
    bookView.initIndexPage();
  };

  module.bookController = bookController;
})(window);
