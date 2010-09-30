$(function() {
  var socket = new io.Socket(null, {
                 transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
               }),
      $stdout = $('#stdout'),
      esc = new RegExp(String.fromCharCode(27) + '\\[([0-9;]*?m)', 'g');
  socket.on('connect', function() { });
  socket.on('disconnect', function() { });

  socket.on('message', function(data) {
    var spans = 0;
    //console.dir(data);
    data = data.replace(esc, function(m, p1) {
      spans++;
      return '<span class="e' + p1.replace(/[;m]/g, ' e') + '">';
    });
    for (var i = 0; i < spans; i++)
      data += '</span>';
    //console.log(data);
    $stdout.append(data);
  });

  socket.connect();
  $(document).keypress(function(e) {
    socket.send(String.fromCharCode(e.which));
    return false;
  });
});
