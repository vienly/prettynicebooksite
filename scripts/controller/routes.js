page('/', function() {
  console.log('home');
  bookController.index();
});

page('/test', function() {
  $('main').children().fadeOut();
  // $('.site-wrap').text('testing message');
});

page('/search/:searchQuery', function(ctx) {
  bookView.handleSearchInput();
  bookModel.requestGoogleBooksData(null, ctx.params.searchQuery);
});

page();
