(function(module){
  var filteredArray = [];
  var goodreadsData;
  var retData = [];

  var view = {};
  var currentResult = [];

  function Input (opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    };
  }

  function Output(bookInfo) {
    this.bookTitle = bookInfo.volumeInfo.title;
    this.thumb = bookInfo.volumeInfo.imageLinks.thumbnail;
    this.author = bookInfo.volumeInfo.authors;
    this.genre = bookInfo.volumeInfo.categories;
    this.publisher = bookInfo.volumeInfo.publisher;
    this.pubDate = bookInfo.volumeInfo.publishedDate;
    this.isbn = bookInfo.volumeInfo.industryIdentifiers[0].identifier;
    this.description = bookInfo.volumeInfo.description;
    this.ratingsCount = bookInfo.volumeInfo.ratingsCount;
    this.grRating = 0;
    this.grRecommendations = [];
  }

  function GRRec(input) {
    this.title = input.title;
    this.grlink = input.link;
    this.rating = input.average_rating;
    this.thumbnail = input.image_url;
    this.isbn = input.isbn;
  }

  var formInput;
  newInput = function(){
    formInput = new Input({
      keyword:        $('#keyword').val().replace(/\W+/g, '+'),
      bookTitle:      $('#book-title').val(),
      author:         $('#author').val(),
      genre:          $('#genre').val(),
      publisher:      $('#publisher').val(),
      isbn:           $('#isbn').val()
    });
  };

  module.search = search;
})(window);
