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

function GRRec(input) {
  this.title = input.title;
  this.grlink = input.link;
  this.rating = input.average_rating;
  this.thumbnail = input.image_url;
  this.isbn = input.isbn;
}

GRRec.prototype.renderRecommendation = function() {
  var template = Handlebars.compile($('#rec-template').text());
  return template(this);
};

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

// var formInput = new Input({
//   keyword:        $('#keyword').val().replace(/\W+/g, '+'),
//   bookTitle:      $('#book-title').val(),
//   author:         $('#author').val(),
//   genre:          $('#genre').val(),
//   publisher:      $('#publisher').val(),
//   isbn:           $('#isbn').val()
// });

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

Output.prototype.renderResults = function(){
  var template = Handlebars.compile($('#results-template').text());
  return template(this);
};

Output.prototype.renderMoreInfo = function(){
  var template = Handlebars.compile($('#detail-template').text());
  return template(this);
};

Output.prototype.renderThumbnails = function(){
  var template = Handlebars.compile($('#thumbnail-template').text());
  return template(this);
};

var view = {};
var currentResult = [];

view.getInfo = function(data){
  console.log(data);
  currentResult = [];
  data.forEach(function(item) {
    var tempt = new Output(item);
    currentResult.push(tempt);

    // $('#results').append(tempt.renderResults());
    $('#results').append(tempt.renderThumbnails());
  });

};

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

showStuff = function(ref){
  $('#results').empty();
  // console.log(ref);
  $('#results').append(ref.renderMoreInfo());
  ref.grRecommendations.forEach(function(item){
    $('#results').append(item.renderRecommendation());
  });
};

$('#form-input').on('change', newInput);
$('#form-input').on('submit', ajaxCall);
$('#results').on('click', '.book', function(){
  console.log($(this).index());
  // console.log(retData[$(this).index()]);
  goodreadsCall(currentResult[$(this).index()]);
});
