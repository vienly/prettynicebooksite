GRRec.prototype.renderRecommendation = function() {
  var template = Handlebars.compile($('#rec-template').text());
  return template(this);
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

view.getInfo = function(data){
  console.log(data);
  currentResult = [];
  data.forEach(function(item){
    var tempt = new Output(item);
    currentResult.push(tempt);

    $('#results').append(tempt.renderResults());
    // $('#results').append(item.renderThumbnails());
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
$('#results').on('click', 'div', function(){
  console.log($(this).index());
  // console.log(retData[$(this).index()]);
  goodreadsCall(currentResult[$(this).index()]);
});
