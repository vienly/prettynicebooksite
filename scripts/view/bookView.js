(function(module) {
  var bookView = {};
  // bookView.formInput;

  var render = function(item, templateId) {
    var template = Handlebars.compile($(templateId).text());
    return template(item);
  };

  bookView.showResults = function(data) {
    data.forEach(function(item){
      $('#results').append(render(item,'#thumbnail-template'));
    });
    $('#results').fadeIn();
  };

  bookView.showBookDetails = function(book){
    $('#results').fadeOut();
    $('#book-details').empty();

    $('#book-details').append(render(book, '#detail-template'));

    book.grRecommendations.forEach(function(recommendedBook){
      $('#book-details').append(render(recommendedBook, '#rec-template'));
    });

    $('#book-details').fadeIn();
  };

  bookView.handleSearchInput = function() {
    $('#form-input').on('change', bookModel.createNewInput);
    $('#form-input').on('submit', function(e) {
      e.preventDefault();
      $('#form-input').on('submit', page('/search/' + bookModel.createEndpoint()));
    });

    $('#results').on('click', '.book', function(){
      console.log($(this).index());
      bookModel.requestGoodReadsData(bookModel.all[$(this).index()]);
    });
  };


  bookView.initIndexPage = function() {
    $('main').children().hide();
    $('.form').fadeIn();
    bookView.handleSearchInput();
  };

  module.bookView = bookView;
})(window);
