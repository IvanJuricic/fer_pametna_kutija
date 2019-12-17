const express = require('express');
const EventEmitter = require('events');
const fs = require('fs');
var tls = require('tls');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/login', (req, res) => {
  const user_name = req.body.user;
  const password = req.body.password;
  console.log("User name = " + user_name + ", password is " + password);
  res.end("yes");
  sockets.forEach((element, index) => {
    element.emit("unlock");
  });
})

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});

console.log(__dirname)
var options = {
  key: fs.readFileSync(__dirname + '/private-key.pem'),
  cert: fs.readFileSync(__dirname + '/public-cert.pem')
};

const PORT = 1337;
const HOST = '192.168.43.134'
sockets = [];

tlsServer = tls.createServer(options, function (socket) {
  sockets.push(socket);


  socket.on('unlock', function () {
    console.log("sock");
    socket.write("unlock");
  });

  socket.on('data', function (data) {
    data = data.toString().replace(/(\n)/gm, "")
    console.log('Server Received: %s [it is %d bytes long]',
      data,
      data.length);
    if (data == '15') {
      socket.emit('unlock');
    }

  });
  socket.on('error', function () {
    console.log(socket)
    socket.removeAllListeners("unlock");
    socket.destroy();
  });

});
// Start listening on a specific port and address
tlsServer.listen(PORT, HOST, function () {

  console.log("I'm listening at %s, on port %s", HOST, PORT);

});

// When an error occurs, show it.
tlsServer.on('error', function (error) {

  console.error(error);

  // Close the connection after the error occurred.
  tlsServer.close(function (error) {

    console.error(error);

  });

});

