$(document).ready(function() {
  function height() {
    windowHeight = $(window).innerHeight();
    $('#map').css('min-height', windowHeight);
    $('#sidebar').css('min-height', windowHeight);
  };
  height();

  $(window).resize(function() {
    height();
  });
});