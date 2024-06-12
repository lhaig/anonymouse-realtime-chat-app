// require the express module
const tls = require('tls');
const fs = require('fs');
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");
const loginRouter = require("./route/loginRoute");
var rootpath = process.env.ROOT_PATH || "/chat";
console.log('root path set to %s', rootpath)



//vault connection
var vault = null
const use_vault = process.env.USE_VAULT || true;
if (use_vault) {
  vault = require("./vault");
}

var router = express.Router();

//require the http module
 const http = require("http").Server(app);


// require the socket.io module
const io = require("socket.io");

const port = 3000;

//bodyparser middleware
app.use(bodyParser.json());

//routes
// app.use("/chats", chatRouter);
// app.use("/login", loginRouter);
app.use("/", router);
app.use(rootpath, router);


router.use(function (req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});


// this will only be invoked if the path ends in /bar
// router.use('/chats', chatRouter);
router.use(rootpath + '/chats', chatRouter);
router.use('/chats', chatRouter);

// always invoked
router.use("/", express.static(__dirname + "/public"));
router.use(rootpath, express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

socket.path(rootpath);
//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect.js");


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
    console.log("message: " + msg);

    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: msg });

    if (use_vault) {
      vault.encryptData(msg).then(response => {
        console.log(response);
        //save the encrypted chat to the database
        connect.then(db => {
          console.log("connected correctly to the server");
          let chatMessage = new Chat({ message: response, sender: "Anonymous" });
          chatMessage.save();
        });
      });
    } else {
      //save chat to the database
      connect.then(db => {
        console.log("connected correctly to the server");
        let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
        chatMessage.save();
      });
    }
  });
});

 http.listen(port, () => {
   console.log("Running on Port: " + port);
 });

 if(true){
//TLS options
var options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('public-cert.pem')
 };

 const https = require("https").Server(options, app);

 const ios = require("socket.io");
//integrating socketio
securesocket = ios(https);

securesocket.path(rootpath);

//setup event listener
securesocket.on("connection", securesocket => {
  console.log("user connected");

  securesocket.on("disconnect", function () {
    console.log("user disconnected");
  });

  //Someone is typing
  securesocket.on("typing", data => {
    securesocket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  securesocket.on("stopTyping", () => {
    securesocket.broadcast.emit("notifyStopTyping");
  });

  securesocket.on("chat message", function (msg) {
    console.log("message: " + msg);

    //broadcast message to everyone in port:5000 except yourself.
    securesocket.broadcast.emit("received", { message: msg });

    if (use_vault) {
      vault.encryptData(msg).then(response => {
        console.log(response);
        //save the encrypted chat to the database
        connect.then(db => {
          console.log("connected correctly to the server");
          let chatMessage = new Chat({ message: response, sender: "Anonymous" });
          chatMessage.save();
        });
      });
    } else {
      //save chat to the database
      connect.then(db => {
        console.log("connected correctly to the server");
        let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
        chatMessage.save();
      });
    }
  });
});

  https.listen(9443, () => {
    console.log("Running on Port: " + 9443);
  });
  
 }

