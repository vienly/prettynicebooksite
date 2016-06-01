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

ajaxCall = function(e){
  e.preventDefault();
  $('#results').empty();
  var endpoint = createEndpoint();
  $.ajax({
    url: endpoint
    + '&maxResults=40'
    + '&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',
    type: 'GET',
    success: function(data) {
      // retData = data;
      retData = data.items.filter(function(item){
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
    }
  }).done(function() {
    view.getInfo(retData);
  });
};

goodreadsCall = function(idx) {
  console.log(idx);
  var myUrl = 'https://www.goodreads.com/book/isbn/' +
  idx.isbn +
  '?key=LbvqOGqzxlFouQJ4ow48w';
  $.get('https://query.yahooapis.com/v1/public/yql',{
    q: 'select * from xml where url=\'' + myUrl + '\'',
    format: 'json'
  },
  function(json){
    goodreadsData = json;
    console.log(goodreadsData);
    idx.grRecommendations = [];
    idx.goodreadsRating = goodreadsData.query.results.GoodreadsResponse.book.average_rating;

    goodreadsData.query.results.GoodreadsResponse.book.similar_books.book.filter(function(item) {
      return item.isbn && item.image_url != 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';
    }).forEach(function (item) {
      var tempt = new GRRec(item);
      idx.grRecommendations.push(tempt);
    });
    showStuff(idx);
  });
};
