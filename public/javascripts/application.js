$(function() {
  $(':text:first').focus();

  var $window = $(window),
      $stdout = $('#stdout'),
      $prompt = $('#prompt');

  var socket = new io.Socket(null, {
      transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
    })
    .on('message', function(data) {
      $stdout.ansi(data);
      $window.uncover($prompt);
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

  $prompt
    .keypress(function(e) {
      socket.send(String.fromCharCode(e.which));
      return false;
    })
    .keydown(function(e) {
      if (e.ctrlKey && e.which >= 64) e.which -= 64;
      if (e.which < 32) {
        socket.send(String.fromCharCode(e.which));
        return false;
      } else {
        switch (e.which) {
        case 37: // left
          socket.send('\033[D');
          return false;
        case 38: // up
          socket.send('\033[A');
          return false;
        case 39: // right
          socket.send('\033[C');
          return false;
        case 40: // down
          socket.send('\033[B');
          return false;
        }
      }
    });

  $(document).click(function() {
    $prompt.focus();
  });
});
