$(document).ready(function() {
  console.log('script running');
  var $navButton = $('.nav-toggle-button');
  $navButton.on('click', function() {
    $(this).toggleClass('active');
    console.log($(this).attr('class'));
  });
});
