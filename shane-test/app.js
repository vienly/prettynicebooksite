// var ret;

function Input (opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  };
}

var formInput;
// var Input = {};
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

var createEndpoint = function(){
  var newUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (formInput.keyword){
    newUrl += formInput.keyword;
  }
  if (formInput.bookTitle){
    newUrl += '+intitle:' + formInput.bookTitle;
  }
  if (formInput.author){
    newUrl += '+inauthor:' + formInput.author;
  }
  if (formInput.genre){
    newUrl += '+insubject:' + formInput.genre;
  }
  if (formInput.publisher){
    newUrl += '+inpublisher:' + formInput.publisher;
  }
  if (formInput.isbn){
    newUrl += '+inisbn:' + formInput.isbn;
  }
  return newUrl;
};

// var keywordInput = $('#keyword').val();
// var bookTitleInput = $('book-title').val().replace(/\W+/g, '+');
// var authorInput = $('author').val().replace(/\W+/g, '+');
// var genreInput = $('genre').val().replace(/\W+/g, '+');
// var publisherInput = $('publisher').val().replace(/\W+/g, '+');
// var isbnInput = $('isbn').val().replace(/\W+/g, '+');
var retData;
ajaxCall = function(e){
  e.preventDefault();
  $('#results').empty();
  var endpoint = createEndpoint();
  console.log(endpoint);
  console.log(formInput.keyword);
  $.ajax({
    url: endpoint
    // 'https://www.googleapis.com/books/v1/volumes' +
    // ?q=wise+inauthor:rothfuss&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',
    // '?q=' +
    // formInput.keyword + //keyword
    // '+' +
    // 'inauthor:' +
    // 'rowling' + //author
    // '+' +
    // 'intitle:' +
    // 'wise' +
    // '+' +
    // 'inpublisher:' +
    // 'penguin' +
    // '+' +
    // 'subject:' +
    // 'fiction' +
    // '+' +
    // 'isbn:' +
    // '9781101486405' +
    + '&maxResults=40' +
    // '&startIndex=30' +
    '&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',

    type: 'GET',
    success: function(data) {
      console.log(data.items);
      retData = data;
      var filteredArray = [];
      var mostFrequentAuth = mostFrequent(data.items);
      console.log(mostFrequentAuth);
      data.items.map(function(item){
        console.log(item.volumeInfo.title);
      });
      var ret = data.items.filter(function(item){
        if(item.volumeInfo.ratingsCount > 10 && item.accessInfo.country === 'US' && item.volumeInfo.language == 'en'){
          return item;
        }
      });
      // .filter(function(item) {
      //   return item.volumeInfo.publisher && item.volumeInfo.publisher === (mostFrequentPub.toString());
      // })
      // .sort((function(a,b){
      //   return b.volumeInfo.publishedDate > a.volumeInfo.publishedDate;
      // }));
      $('#results').html(ret.map(function(item){
        return item.volumeInfo.title + '</br>';
      }));
    }
  }
);
};

$('#form-input').on('change', newInput);
$('#form-input').on('submit', ajaxCall);
