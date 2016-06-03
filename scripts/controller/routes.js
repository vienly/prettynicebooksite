page('/', function() {
  bookController.index();
});

page('/team', function() {
  $('main').children().fadeOut();
  bookView.initTeamPage();
});

page('/search/:searchQuery', function(ctx) {

  bookModel.requestGoogleBooksData(null, ctx.params.searchQuery);
});

page();
