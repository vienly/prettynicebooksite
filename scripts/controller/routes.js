page('/', function() {
  // console.log('home');
  bookController.index();
});

page('/test', function() {
  $('main').children().fadeOut();
  bookView.initTeamPage();
  // $('.site-wrap').text('testing message');
});

page('/search/:searchQuery', function(ctx) {

  bookModel.requestGoogleBooksData(null, ctx.params.searchQuery);
});

page();
