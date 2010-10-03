$(function() {
  $(':text:first').focus();

  var $window = $(window),
      $stdout = $('#stdout'),
      $prompt = $('#prompt');

  var socket = new io.Socket(null, {
      transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
    })
    .on('message', function(data) {
      $stdout.append($.ansi.colorize(data));
      $window.scrollTo($prompt);
    })
    .connect();

  $('form')
    .submit(function() {
      socket.send($(this).serialize());
      $stdout.text('');
      $prompt.focus();
      return false;
    })
    .click(function(e) { e.stopPropagation(); });

  $prompt.keypress(function(e) {
    socket.send(String.fromCharCode(e.which));
    return false;
  });

  $(document).click(function() {
    $prompt.focus();
  });
});
