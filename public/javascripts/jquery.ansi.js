(function($, undefined) {
  var re = {
    ansi: /\x1b\[([0-9;]*?)([A-Za-z])/,
    xterm: /\x1b][0-9];(.*?)\x07/
  },

  ansi = function(esc, buf) {
    var m = re.ansi.exec(esc);
    switch (m[2]) {
      case 'K':
        if (!m[1])
          buf.line.splice(buf.cursor);
        else if (m[1] === 1)
          buf.line.splice(0, buf.cursor + 1);
        else if (m[1] === 2)
          buf.line.splice(0, buf.line.length);
        break;
      case 'm':
        ns = (m[1] || '0').split(';').map(function(n) { return 'm' + Number(n); });
        buf.line.push('<span class="' + ns.join(' ') + '">');
        break;
      default:
        console.log('CSI ' + m[1] + ' ' + m[2]);
    }
  };

  $.fn.ansi = function(data) {
    var $this = $(this), buf = $this.data('buf') || [[]], l, esc;

    buf.line = buf.line || buf.slice(-1)[0];
    buf.cursor = buf.cursor || 0;

    console.log('r: ' + data);
    data.split('').forEach(function(c) {
      if (c === '\x1b') {
        esc = c;
      } else if (esc) {
        esc += c;
        if (esc[1] === '[' && c.match(/[A-Za-z]/)) {
          ansi(esc, buf);
          esc = null;
        } else if (esc[1] === ']' && c === '\x07') {
          $('title').text(re.xterm.exec(esc)[1]);
          esc = null;
        }
      } else if (c === '\r') {
        // ignore ?
      } else if (c === '\n') {
        buf.push(buf.line = []);
        buf.cursor = 0;
      } else {
        buf.line.push(c);
        buf.cursor++;
      }
    });
    console.log(buf);

    $this
      .data('buf', buf)
      .html(buf.slice(-30).map(function(l) { return l.join(''); }).join('\n'));

    return this;
  };
})(jQuery);
