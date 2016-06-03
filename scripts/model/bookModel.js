(function (module) {
  var bookModel = {};
  bookModel.all = [];
  bookModel.GBdata = [];
  bookModel.formInput;

  function Input (opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    };
  }

  function Book(bookInfo) {
    this.bookTitle = bookInfo.volumeInfo.title;
    this.thumb = bookInfo.volumeInfo.imageLinks.thumbnail;
    this.author = bookInfo.volumeInfo.authors;
    this.genre = bookInfo.volumeInfo.categories;
    this.publisher = bookInfo.volumeInfo.publisher;
    this.pubDate = bookInfo.volumeInfo.publishedDate;
    this.isbn = bookInfo.volumeInfo.industryIdentifiers[0].identifier;
    this.description = bookInfo.volumeInfo.description;
    if(this.description) { this.shortDescription = this.description.substring(0, 250) + '...'; }
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

  bookModel.createNewInput = function(){
    bookModel.formInput = new Input({
      keyword:        $('#keyword').val().replace(/\W+/g, '+'),
      bookTitle:      $('#book-title').val(),
      author:         $('#author').val(),
      genre:          $('#genre').val(),
      publisher:      $('#publisher').val(),
      isbn:           $('#isbn').val()
    });
  };

  bookModel.createEndpoint = function(){
    var newUrl = '';
    if (bookModel.formInput.keyword) { newUrl += bookModel.formInput.keyword; }
    if (bookModel.formInput.bookTitle) { newUrl += '+intitle:' + bookModel.formInput.bookTitle; }
    if (bookModel.formInput.author) { newUrl += '+inauthor:' + bookModel.formInput.author; }
    if (bookModel.formInput.genre) { newUrl += '+insubject:' + bookModel.formInput.genre; }
    if (bookModel.formInput.publisher) { newUrl += '+inpublisher:' + bookModel.formInput.publisher; }
    if (bookModel.formInput.isbn) { newUrl += '+inisbn:' + bookModel.formInput.isbn; }
    return newUrl;
  };

  bookModel.requestGoogleBooksData = function(e, endPoint){
    if(e) {
      e.preventDefault();
    }
    $('.result-header').siblings().remove();
    var newUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
    newUrl += endPoint;
    $.ajax({
      url: newUrl
      + '&maxResults=40'
      + '&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',
      type: 'GET',
      success: function(data) {
        if(data.items) {
          bookModel.GBdata = data.items.filter(function(item){
            if(item.volumeInfo.ratingsCount > 10
              && item.accessInfo.country === 'US'
              && item.volumeInfo.language == 'en'
              && item.volumeInfo.imageLinks
              && item.volumeInfo.publishedDate
              && item.volumeInfo.publisher
              && item.volumeInfo.industryIdentifiers
            ){
              return item;
            }
          });
        } else {
          console.log('No Result');
        }
      }
    }).done(function() {
      importBooks(bookModel.GBdata);
      bookView.showResults(bookModel.all);
      bookView.handleClickBook();
    });
  };

  var importBooks = function(data) {
    bookModel.all = [];
    data.forEach(function(item) {
      var newBook = new Book(item);
      bookModel.all.push(newBook);
    });
  };

  bookModel.requestGoodReadsData = function(selectedBook) {
    var myUrl = 'https://www.goodreads.com/book/isbn/' +
    selectedBook.isbn +
    '?key=LbvqOGqzxlFouQJ4ow48w';
    $.get('https://query.yahooapis.com/v1/public/yql',{
      q: 'select * from xml where url=\'' + myUrl + '\'',
      format: 'json'
    },
    function(responseData){
      if(responseData.query.results.GoodreadsResponse.book.similar_books) {
        selectedBook.grRecommendations = [];
        selectedBook.goodreadsRating = responseData.query.results.GoodreadsResponse.book.average_rating;
        responseData.query.results.GoodreadsResponse.book.similar_books.book.filter(function(item) {
          return item.isbn && item.image_url != 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';
        }).forEach(function(item) {
          var recBook = new GRRec(item);
          selectedBook.grRecommendations.push(recBook);
        });
      } else {
        console.log('No Goodreads Data');
      }
      bookView.showBookDetails(selectedBook);
    });
  };

  module.bookModel = bookModel;
})(window);
