(function(module) {
  var bookView = {};

  var render = function(item, templateId) {
    var template = Handlebars.compile($(templateId).text());
    return template(item);
  };

  bookView.showResults = function(data) {
    $('#results').empty();
    $('#results').siblings().fadeOut();

    data.forEach(function(item){
      $('#results').append(render(item,'#thumbnail-template'));
    });
    $('#results').fadeIn();
  };

  bookView.showBookDetails = function(book){
    $('#book-details').append(render(book, '#detail-template'));

    book.grRecommendations.forEach(function(recommendedBook){
      $('#book-details').append(render(recommendedBook, '#rec-template'));
    });

    $('.book-detail-backdrop').fadeIn().children().fadeIn();
  };

  bookView.handleSearchInput = function() {
    $('#form-input').on('change', bookModel.createNewInput);
    $('#form-input').on('submit', function(e) {
      e.preventDefault();
      $('#form-input').on('submit', page('/search/' + bookModel.createEndpoint()));
    });
  };

  bookView.handleClickBook = function() {
    $('#results').on('click', '.book', function(){
      bookModel.requestGoodReadsData(bookModel.all[$(this).index()]);
    });

    $('.book-details').on('scroll', function() {
      var distance = $(this).scrollTop();
      $('.close-details').css('top', distance);
    });

    $('.close-details').on('click', function() {
      $('.close-details').siblings().remove();
      $('.book-detail-backdrop').fadeOut().children().fadeOut();
    });
  };

  bookView.initIndexPage = function() {
    $('main').children().hide();
    $('.form').fadeIn();
    bookView.handleSearchInput();
  };

  bookView.initTeamPage = function(){
    $('main').children().hide();
    $('.container-fluid').fadeIn();
  };

  module.bookView = bookView;
})(window);
