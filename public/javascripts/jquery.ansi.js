(function($, window, document, undefined) {
  var xterm = new RegExp('\033][0-9];(.*?)\007', 'g'),
      esc = new RegExp('\033\\[([0-9;]*?m)', 'g');

  var debug = function(s) {
    return;
    console.log(s.split('').map(function(c) {
      return c + '=' + c.charCodeAt(0);
    }));
  };

  $.ansi = {
    colorize: function(data) {
      var spans = 0;
      debug(data);
      data = $('<div>').text(data).html()
      .replace(xterm, function(m, p1) {
          $('title').text(p1);
          return '';
        })
        .replace(esc, function(m, p1) {
          spans++;
          return '<span class="e' + p1.replace(/[;m]/g, ' e') + '">';
        });
      for (var i = 0; i < spans; i++)
        data += '</span>';

      return data;
    }
  };
})(jQuery, window, document);
