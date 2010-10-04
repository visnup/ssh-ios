(function($, undefined) {
  var xterm = new RegExp('\x1b][0-9];(.*?)\x07', 'g'),
      ansi_csi = new RegExp('\x1b\\[([0-9;]*?)([A-Za-z])', 'g');

  $.ansi = {
    colorize: function(data) {
      var spans = 0;
      data = $('<div>').text(data).html()
        .replace(xterm, function(m, s) {
          $('title').text(s);
          return '';
        })
        .replace(ansi_csi, function(m, n, cmd) {
          console.log('CSI ' + n + ' ' + cmd);
          switch (cmd) {
            case 'm':
              ns = (n || '00').split(';').map(function(n) { return 'm' + Number(n); });
              spans++;
              return '<span class="' + ns.join(' ') + '">';
            default:
              return '';
          }
        });
      console.log(data);

      return data;
    }
  };
})(jQuery);
