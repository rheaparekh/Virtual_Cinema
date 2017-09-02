const os = require('os');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const multer = require('multer');
const upload = multer({ dest: 'public/images/' });


app.use('/static', express.static(__dirname +  '/public'));

app.get('/', function (req, res) {
  res.sendFile('index.html', {"root": __dirname});
});

app.post('/receiveSnap', upload.single('data'), function (req, res) {
  res.json({hello:req.file.mimetype});
});

/*
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
*/

io.on('connection', function(socket) {
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var numClients = io.sockets.clients().length;
    numClients = 1;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 1) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
    } else if (numClients === 2) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      // io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready', room);
      socket.broadcast.emit('ready', room);
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });

});

server.listen(process.env.PORT || 8080);
