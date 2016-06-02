(function(module) {
  var bookView = {};
  // bookView.formInput;

  var render = function(item, templateId) {
    var template = Handlebars.compile($(templateId).text());
    return template(item);
  };

  // createNewInput = function(){
  //   bookView.formInput = new Input({
  //     keyword:        $('#keyword').val().replace(/\W+/g, '+'),
  //     bookTitle:      $('#book-title').val(),
  //     author:         $('#author').val(),
  //     genre:          $('#genre').val(),
  //     publisher:      $('#publisher').val(),
  //     isbn:           $('#isbn').val()
  //   });
  // };

  bookView.handleSearchInput = function() {
    $('#form-input').on('change', bookModel.createNewInput);
    $('#form-input').on('submit', bookModel.requestGoogleBooksData);
    $('#results').on('click', '.book', function(){
      console.log($(this).index());
      bookModel.requestGoodReadsData(bookModel.all[$(this).index()]);
    });
  };

  bookView.handleSearchInput();

  module.bookView = bookView;
})(window);
