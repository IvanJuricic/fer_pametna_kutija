const express = require('express');
const path = require('path');
const fs = require('fs');
const tls = require('tls');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const UserModel = require('./user');
const mongoose = require('mongoose');
const https = require('https')


const indexRouter = require('./routes/indexRoutes')();
const userRouter = require('./routes/userRoutes')();

const app = express();

var bodyParser = require('body-parser');
app.use(cookieParser());

require('./config/passport.js')(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect("mongodb://127.0.0.1:27017/smart-box");

bcrypt.hash("admin", 10).then(function (passwordHash) {
  try {
    const userDocument = new UserModel({ username: "admin", passwordHash, role: "ADMIN" });
    userDocument.save();
    console.log("admin user created");

  } catch{
    console.log("admin user already exists");
  }
});

console.log(userRouter);

app.use(('/'), indexRouter);
app.use(('/user'), userRouter);

app.use(express.static(path.join(__dirname, '/../dist')));

// app.post('/login', (req, res) => {
//   const user_name = req.body.user;
//   const password = req.body.password;
//   console.log("User name = " + user_name + ", password is " + password);
//   res.end("yes");
//   sockets.forEach((element, index) => {
//     element.emit("unlock");
//   });
// });

https.createServer({
  key: fs.readFileSync(__dirname + '/server.key'),
  cert: fs.readFileSync(__dirname + '/server.cert')
}, app)
  .listen(8000, function () {
    console.log('Example app listening on port 8000! Go to https://localhost:8000/')
  });

var options = {
  key: fs.readFileSync(__dirname + '/private-key.pem'),
  cert: fs.readFileSync(__dirname + '/public-cert.pem')
};

const PORT = 1337;
const HOST = '192.168.5.18'
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
