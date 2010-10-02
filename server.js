var express = require('express'),
    io = require('socket.io'),
    pub = __dirname + '/public',

app = express.createServer(
  express.compiler({ src: pub, enable: ['sass'] }),
  express.staticProvider(pub),
  express.logger(),
  express.errorHandler({ dumpExceptions: true, showStack: true })
),

socket = io.listen(app);

socket.on('connection', function(client) {
  var spawn = require('child_process').spawn,
      ssh = spawn('ssh', ['-t', '-t', 'pinkyurl.com']),
      running = true;

  ssh.on('exit', function() { running = false; });
  ssh.stderr.on('data', function(data) { client.send(data); });
  ssh.stdout.on('data', function(data) { client.send(data); });

  client.on('message', function(data) {
    if (data === '\r') data = '\n';
    ssh.stdin.write(data);
  });

  client.on('disconnect', function() {
    if (running) ssh.kill();
  });
});

app.get('/', function(req, res) {
  res.render('index.jade');
});

app.listen(process.env.PORT || 8000);
