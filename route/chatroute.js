const express = require("express");
const bodyParser = require("body-parser");
const connectdb = require("./../dbconnect");
const Chats = require("./../models/Chat");
var rootpath = process.env.ROOT_PATH || "/chat";
//vault connection
var vault = null
const use_vault = process.env.USE_VAULT || true;
if(use_vault){
  vault = require("../vault");
}

const router = express.Router();

router.route("/").get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  connectdb.then(db => {
    let data = Chats.find({ message: "Anonymous" });
    Chats.find({}).then(chat => {
      if(use_vault){
       chat.forEach((item) => {
          if (item.message.startsWith("vault")) {
            item.message = vault.decryptData(item.message)
          }
        })
      }
      let test = vault.decryptData("vault:v1:5/xF9E/yoSID5OKWk+bI5uoNP8jSuzoX7QAb1ca2PFc=")
      console.log("Test Decrypt",test)
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
      if(use_vault){
        chat.forEach((item) => {
           if (item.message.startsWith("vault:")) {
            item.message = vault.decryptData(item.message)
           };
          })
       }
       console.log("Test Decrypt",vault.decryptData("vault:v1:5/xF9E/yoSID5OKWk+bI5uoNP8jSuzoX7QAb1ca2PFc="))
       res.json(chat);
    });
  });
});

module.exports = router;
