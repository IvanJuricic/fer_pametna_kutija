const express = require('express');
const path = require('path');
const fs = require('fs');
const tls = require('tls');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const RFIDModel = require('./models/rfid');
const UserModel = require('./models/user');
const https = require('https')



const app = express();

var bodyParser = require('body-parser');
app.use(cookieParser());

require('./config/passport.js')(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const mongoose = require('./config/mongoose')();

bcrypt.hash("admin", 10).then(function (passwordHash) {
  try {
    const userDocument = new UserModel({ username: "admin@admin.com", passwordHash, role: "ADMIN" });
    userDocument.save();
    console.log("admin user created");

  } catch{
    console.log("admin user already exists");
  }
});



// const RFID1 = new RFIDModel({ RFID: "1234567891" });
// RFID1.save();
// const RFID2 = new RFIDModel({ RFID: "1234567892" });
// RFID2.save();
// const RFID3 = new RFIDModel({ RFID: "12345678913" });
// RFID3.save();

sockets = [];

const indexRouter = require('./routes/indexRoutes')();
const userRouter = require('./routes/userRoutes')();
const adminRouter = require('./routes/adminRoutes')(mongoose, sockets);

app.use(('/'), indexRouter);
app.use(('/user'), userRouter);
app.use(('/admin'), adminRouter);

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
const HOST = '192.168.43.134'

tlsServer = tls.createServer(options, function (socket) {
  sockets.push(socket);
  socket.setTimeout(4000);
  socket.on('timeout', () => {
    socket.end();
    sockets.shift();
  });

  socket.on('unlock', function () {
    socket.write("unlock");
  });

  socket.on('remove', function (args) {
    let message = {};
    message.type = 2;
    message.RFID = args[0].RFID;
    socket.write(JSON.stringify(message));
    console.log("remove");
  });

  socket.on('add', function (args) {
    let message = {};
    message.type = 1;
    message.RFID = args[0].RFID;
    socket.write(JSON.stringify(message));
    console.log("add");
  });

  socket.on('update', function (args) {
    let message = {};
    message.type = 3;
    message.RFID_old = args[0].oldRFID;
    message.RFID = args[0].RFID;
    socket.write(JSON.stringify(message));
    console.log(JSON.stringify(message));
  });
  
  socket.on('file', function (args) {
    let message = {};
    message.type = 6;
    message.file="";
    console.log(args);
    args.forEach(RFID => {
      message.file+=RFID.RFID;
    });
    message.length=message.file.length;
    socket.write(JSON.stringify(message));
    console.log(JSON.stringify(message));
  });

  socket.on('data', function (data) {
    data = data.toString().replace(/(\n)/gm, "");
    try {
      data = JSON.parse(data);

      switch (data.type) {
        case "NEW":
          let RFID = new RFIDModel({ RFID: data.value });
          RFID.save();
          break;
        case "DATA":
          console.log(data);
          break;
        default:
          break;
      }

    } catch (error) {
    }

  });
  socket.on('error', function () {
    sockets.shift();
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

  // Close the connection after the error occurred.
  tlsServer.close(function (error) {

    console.error(error);

  });

});
