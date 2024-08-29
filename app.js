// require the express module
const fs = require('fs');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");

const https = require("https");
const http = require("http");
const ios = require("socket.io");
const io = require("socket.io");

//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect.js");

const use_vault = process.env.USE_VAULT || false;
const port = process.env.HTTP_PORT || 3000;
const bind_addr = process.env.BIND_ADDR || "0.0.0.0";
const pkey_path = process.env.PRIVATE_KEY_PATH || 'private-key.pem';
const cert_path = process.env.PUBLIC_CERT_PATH || 'public-cert.pem';
const use_tls = process.env.HTTP_TLS || false;
const rootpath = process.env.ROOT_PATH || "";

//vault connection
var vault = null
if (use_vault) {
  vault = require("./vault");
}

//bodyparser middleware
app.use(bodyParser.json());

var router = express.Router();
router.use(function (req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// this will only be invoked if the path ends in /bar
console.log('root path set to %s', rootpath)
router.use(rootpath + '/chats', chatRouter);

// always invoked
router.use("/", express.static(__dirname + "/public"));
router.use(rootpath, express.static(__dirname + "/public"));

//set the router on the server
app.use("/", router);
app.use(rootpath, router);

//integrating socketio
var socket = null;
var options = {}

if (use_tls) {
  //TLS options
  options = {
    key: fs.readFileSync(pkey_path),
    cert: fs.readFileSync(cert_path)
  };

  server = https.Server(options, app);
  server.listen(port, bind_addr, () => {
    console.log("Running on Port: " + port, "Bind Address: " + bind_addr,"with TLS");
  });

  socket = ios(server);
} else {
  server = http.Server(options, app);
  server.listen(port, bind_addr, () => {
    console.log("Running on Port: " + port, "Bind Address: " + bind_addr, "without TLS");
  });

  socket = io(server);
}

socket.path(rootpath);

//setup event listener
socket.on("connection", socket => {
  console.log("user connected");

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("chat message", function (msg) {
    
    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: msg });

    if (use_vault) {
      vault.encryptData(msg).then(response => {
        console.log("message: " + response);
        //save the encrypted chat to the database
        connect.then(db => {
          console.log("connected correctly to the server");
          let chatMessage = new Chat({ message: response, sender: "Anonymous" });
          chatMessage.save();
        });
      });
    } else {
      //save chat to the database
      console.log("message: " + msg);
      connect.then(db => {
        console.log("connected correctly to the server");
        let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
        chatMessage.save();
      });
    }
  });
});