(function($, window, document, undefined) {
  var esc = new RegExp(String.fromCharCode(27) + '\\[([0-9;]*?m)', 'g');

  $.ansi = {
      colorize: function(data) {
      var spans = 0;
      data = $('<div>').text(data).html().replace(esc, function(m, p1) {
        spans++;
        return '<span class="e' + p1.replace(/[;m]/g, ' e') + '">';
      });
      for (var i = 0; i < spans; i++)
        data += '</span>';

      return data;
    }
  };
})(jQuery, window, document);
