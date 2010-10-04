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
      console.log("p: " + e.which + ' (' + String.fromCharCode(e.which) + ')');
      return false;
    })
    .keydown(function(e) {
      console.log("d: " + e.which + ' (' + String.fromCharCode(e.which) + ')');
      //console.log(e);
      if (e.ctrlKey && e.which >= 64) {
        socket.send(String.fromCharCode(e.which - 64));
        return false;
      } else {
        switch(e.which) {
          case 8:
          case 9:
            socket.send(String.fromCharCode(e.which));
            return false;
        }
      }
    });

  $(document).click(function() {
    $prompt.focus();
  });
});
