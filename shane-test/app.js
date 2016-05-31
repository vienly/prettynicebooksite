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

app = function(dataOutput){
  $('#results').append(dataOutput.renderResults($('#results-template')));
};

var view = {};
view.getInfo = function(data){
  data.forEach(function(item){
    item = new Output({
      bookTitle:    item.volumeInfo.title,
      thumb:        item.volumeInfo.imageLinks.thumbnail,
      author:       item.volumeInfo.authors,
      genre:        item.volumeInfo.category,
      publisher:    item.volumeInfo.publisher,
      isbn:         item.volumeInfo.categories,
      description:  item.volumeInfo.description
    });
    $('#results').append(item.renderResults());
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

var retData;
ajaxCall = function(e){
  e.preventDefault();
  $('#results').empty();
  var endpoint = createEndpoint();
  // console.log(endpoint);
  // console.log(formInput.keyword);
  $.ajax({
    url: endpoint
    // 'https://www.googleapis.com/books/v1/volumes' +
    // ?q=wise+inauthor:rothfuss&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',
    + '&maxResults=40' +
    '&?key=AIzaSyCfsM3QeTqrabiuQ1f97bB7pawjROuhhv0',

    type: 'GET',
    success: function(data) {
      // console.log(data.items);
      retData = data;
      // var filteredArray = [];
      var mostFrequentPub = mostFrequent(data.items);
      // console.log('most frequent publisher: ' + mostFrequentPub);
      data.items.map(function(item){
        // console.log(item.volumeInfo.title);
      });
      var ret = data.items.filter(function(item){
        if(item.volumeInfo.ratingsCount > 10 && item.accessInfo.country === 'US' && item.volumeInfo.language == 'en' && item.volumeInfo.imageLinks.thumbnail){
          return item;
        }
      });
      // .reduce(function(a,b){
      //   // console.log('a: ' + a.volumeInfo.title);
      //   // console.log('b: ' + b.volumeInfo.title);
      //   if (a.indexOf(b.volumeInfo.title) < 0 ) a.push(b);
      //   // console.log('a: ' + a);
      //   return a;
      // },[]);
      //
      // .reduce(function(a, arr){
      //   if (arr.length > 0){
      //     return arr.indexOf(a) !== -1;
      //   }
      //   console.log(arr);
      // }, []);
      // .filter(function(item) {
      //   return item.volumeInfo.publisher && item.volumeInfo.publisher === (mostFrequentPub.toString());
      // })
      // .sort((function(a,b){
      //   return b.volumeInfo.publishedDate > a.volumeInfo.publishedDate;
      // }));
      // ret.forEach(function(item){
      //   var output = new Output(item);
      //   $('#results').append(renderResults(output));
      // });
      view.getInfo(ret);
      // $('#results').html(ret.map(function(item){
      //   return item.volumeInfo.title + '</br>';
      // }));
    }
  }
);
};

$('#form-input').on('change', newInput);
$('#form-input').on('submit', ajaxCall);
