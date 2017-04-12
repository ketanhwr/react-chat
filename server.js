const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const port = 3000;
const app = express();

var server = require('http').Server(app);

const io = require('socket.io').listen(server);

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.get('*', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
  res.end();
});

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

var userId = 1;

io.on('connection', function(socket){
  console.log("client connected!");

  socket.on('user:request', function(msg) {
    socket.emit('user:join', { id: userId });
    userId++;
  });

  socket.on('send:message', function(msg) {
    io.emit('send:message', msg);
  });

  socket.on('user:left', function(msg) {
    console.log("client disconnected!");
    socket.broadcast.emit('user:left', msg);
  })

});