(function (module) {
  var bookModel = {};
  bookModel.all = [];
  bookModel.GBdata = [];

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
  bookModel.createNewInput = function(){
    formInput = new Input({
      keyword:        $('#keyword').val().replace(/\W+/g, '+'),
      bookTitle:      $('#book-title').val(),
      author:         $('#author').val(),
      genre:          $('#genre').val(),
      publisher:      $('#publisher').val(),
      isbn:           $('#isbn').val()
    });
  };

  // make endpoint for GB API req
  var createEndpoint = function(){
    var newUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
    if (formInput.keyword) { newUrl += formInput.keyword; }
    if (formInput.bookTitle) { newUrl += '+intitle:' + formInput.bookTitle; }
    if (formInput.author) { newUrl += '+inauthor:' + formInput.author; }
    if (formInput.genre) { newUrl += '+insubject:' + formInput.genre; }
    if (formInput.publisher) { newUrl += '+inpublisher:' + formInput.publisher; }
    if (formInput.isbn) { newUrl += '+inisbn:' + formInput.isbn; }
    return newUrl;
  };

  // make ajax call to GB API
  bookModel.requestGoogleBooksData = function(e){
    e.preventDefault();
    $('#results').empty();
    var endpoint = createEndpoint();
    $.ajax({
      url: endpoint
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
              && item.volumeInfo.industryIdentifiers.length
            ){
              return item;
            }
          });
        } else {
          console.log('no result');
        }
      }
    }).done(function() {
      importBooks(bookModel.GBdata);
      bookView.showResults(bookModel.all);
    });
  };

  // convert data obtained from Google Books into our book Objects
  var importBooks = function(data) {
    bookModel.all = [];
    data.forEach(function(item) {
      var newBook = new Book(item);
      bookModel.all.push(newBook);
    });
  };

  // make call to GR API using an input book
  bookModel.requestGoodReadsData = function(selectedBook) {
    console.log(selectedBook);
    var myUrl = 'https://www.goodreads.com/book/isbn/' +
    selectedBook.isbn +
    '?key=LbvqOGqzxlFouQJ4ow48w';
    $.get('https://query.yahooapis.com/v1/public/yql',{
      q: 'select * from xml where url=\'' + myUrl + '\'',
      format: 'json'
    },
    // callback that handles goodreads response
    function(responseData){
      console.log(responseData);

      if(responseData.query.results.GoodreadsResponse) {
        selectedBook.grRecommendations = [];
        selectedBook.goodreadsRating = responseData.query.results.GoodreadsResponse.book.average_rating;

        responseData.query.results.GoodreadsResponse.book.similar_books.book.filter(function(item) {
          return item.isbn && item.image_url != 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';
        }).forEach(function(item) {
          var recBook = new GRRec(item);
          selectedBook.grRecommendations.push(recBook);
        });
        bookView.showBookDetails(selectedBook);
      } else {
        console.log('NO GOODREADS DATA');
        // render only the book details and not the recommendations here
      }
    });
  };

  module.bookModel = bookModel;
})(window);
