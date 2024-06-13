const express = require("express");
const bodyParser = require("body-parser");
const connectdb = require("../dbconnect.js");
const Chats = require("./../models/Chat");
var rootpath = process.env.ROOT_PATH || "/chat";

//vault connection
var vault = null
const use_vault = process.env.USE_VAULT || false;
if (use_vault) {
  vault = require("../vault");
}

const router = express.Router();

router.route("/").get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  getMessages().then((ret) => {
    res.json(ret);
  });
});

router.route(rootpath).get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  getMessages().then((ret) => {
    res.json(ret);
  });
});

async function getMessages() {
  await connectdb;
  let chat = await Chats.find({});

  if (use_vault) {
    var retorno = []
    for( const item of chat) {
      if (typeof item.message !== 'undefined' && item.message.startsWith("vault:")) {
        console.log("Decrypting message");
        let msg = await vault.decryptData(item.message)
        item.message = msg;
        retorno.push(item);
      } else {
        retorno.push(item);
      }
    }

    return retorno;
  } else {
    return await chat
  }
}

module.exports = router;