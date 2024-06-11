const express = require("express");
const bodyParser = require("body-parser");
const connectdb = require("../dbconnect.js");
const Chats = require("./../models/Chat");
var rootpath = process.env.ROOT_PATH || "/chat";

const router = express.Router();

router.route("/").get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  connectdb.then(db => {
    let data = Chats.find({ message: "Anonymous" });
    Chats.find({}).then(chat => {
      res.json(chat);
    });
  });
});

router.route(rootpath).get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  connectdb.then(db => {
    let data = Chats.find({ message: "Anonymous" });
    Chats.find({}).then(chat => {
      res.json(chat);
    });
  });
});

module.exports = router;
