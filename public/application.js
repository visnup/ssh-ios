$(function() {
  var socket = new io.Socket(null, {
    transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
  });

  var $stdout = $('#stdout'),
      esc = new RegExp(String.fromCharCode(27) + '\\[([0-9;]*?m)', 'g');
  socket.on('message', function(data) {
    var spans = 0;
    data = $('<div>').text(data).html().replace(esc, function(m, p1) {
      spans++;
      return '<span class="e' + p1.replace(/[;m]/g, ' e') + '">';
    });
    for (var i = 0; i < spans; i++)
      data += '</span>';
    $stdout.append(data);
    $(window).scrollTo($('input'));
  });
  socket.connect();

  $(document).keypress(function(e) {
    socket.send(String.fromCharCode(e.which));
    return false;
  });

  $(document).click(function(e) {
    $('input').focus();
  }).click();
});
