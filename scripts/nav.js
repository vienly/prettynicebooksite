$(document).ready(function() {
  console.log('script running');
  var $navButton = $('.nav-toggle-button');
  var $siteWrapper = $('.site-wrap');
  $navButton.on('click', function() {
    $(this).toggleClass('navActive');
    $siteWrapper.toggleClass('navActive');
    console.log($(this).attr('class'));

  });
});
