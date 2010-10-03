module.exports = require('connect').middleware.compiler.compilers.sass;
module.exports.compile = function(str, fn) {
  try {
    var sass = require('child_process').spawn('sass', ['--stdin']),
        append = function(data) { css += data; },
        css = '';
    sass.stdout.on('data', append);
    sass.stderr.on('data', append);
    sass.on('exit', function(code) {
      if (code === 0)
        fn(null, css);
      else
        fn(new Error('sass exited with code: ' + code + '\n' + css));
    });
    sass.stdin.write(new Buffer(str));
    sass.stdin.end();
  } catch(err) {
    fn(err);
  }
};
