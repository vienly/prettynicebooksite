function Input (opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  };
}

function Output (opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  };
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

Output.prototype.renderResults = function(){
  var template = Handlebars.compile($('#results-template').text());
  return template(this);
};

var view = {};
view.getInfo = function(data){
  data.forEach(function(item){
    item = new Output({
      bookTitle:    item.volumeInfo.title,
      thumb:        item.volumeInfo.imageLinks.thumbnail,
      author:       item.volumeInfo.authors,
      genre:        item.volumeInfo.categories,
      publisher:    item.volumeInfo.publisher,
      pubDate:      item.volumeInfo.publishedDate,
      isbn:         item.volumeInfo.industryIdentifiers[0].identifier,
      description:  item.volumeInfo.description,
      ratingsCount: item.volumeInfo.ratingsCount
    });
    $('#results').append(item.renderResults());
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

var retData;
ajaxCall = function(e){
  e.preventDefault();
  $('#results').empty();
  var endpoint = createEndpoint();
  // console.log(endpoint);
  $.ajax({
    url: endpoint
    // 'https://www.googleapis.com/books/v1/volumes' +
    // ?q=wise+inauthor:rothfuss&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',
    + '&maxResults=40'
    + '&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',
    type: 'GET',
    success: function(data) {
      // console.log(data.items);
      retData = data;
      // var mostFrequentPub = mostFrequent(data.items);
      // console.log('most frequent publisher: ' + mostFrequentPub);
      var ret = data.items.filter(function(item){
        if(item.volumeInfo.ratingsCount > 10
          && item.accessInfo.country === 'US'
          && item.volumeInfo.language == 'en'
          && item.volumeInfo.imageLinks
          && item.volumeInfo.publishedDate){
          return item;
        }
      });
      // .sort((function(a,b){
      //   // console.log('b ratings: ' + b.volumeInfo.ratingsCount, 'a ratings: ' + a.volumeInfo.ratingsCount);
      //   return b.volumeInfo.ratingsCount - a.volumeInfo.ratingsCount;
      // }));
      view.getInfo(ret);
      // .reduce(function(a, arr){
      //   if (arr.length > 0){
      //     return arr.indexOf(a) !== -1;
      //   }
      //   console.log(arr);
      // }, []);
      // .filter(function(item) {
      //   return item.volumeInfo.publisher && item.volumeInfo.publisher === (mostFrequentPub.toString());
      // })

    }
  }
);
};


//Goodreads ++++++++++++++++++++++

// var url = "https://www.goodreads.com/book/isbn/0613496744?key=LbvqOGqzxlFouQJ4ow48w";
//
// $.get("https://query.yahooapis.com/v1/public/yql",
//     {
//         q: "select * from xml where url=\""+url+"\"",
//         format: "json"
//     },
//     function(json){
//         // contains XML with the following structure:
//         // <query>
//         //   <results>
//         //     <GoodreadsResponse>
//         //        ...
//         console.log(json);
//     }
// );

$('#form-input').on('change', newInput);
$('#form-input').on('submit', ajaxCall);
