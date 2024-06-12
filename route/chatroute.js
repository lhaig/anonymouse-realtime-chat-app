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
  var retorno = [];
  connectdb.then(db => {
    let data = Chats.find({ message: "Anonymous" });
    Chats.find({}).then(chat => {
      if(use_vault){
        try {
          chat.forEach((item) => {
            if (item.message.startsWith("vault:")) {
            vault.decryptData(item.message).then((msg) => {
             item.message = msg;
             console.log(item.message);
              retorno.push(item);
            });
            
            };
           })
        } catch (error) {
          console.error('Error decrypting data:', error);
        }
       
       }else{
        retorno = chat
     }
       vault.decryptData("vault:v1:CycXZVBlwsMBwi4PW8LE6FbqIqRH/UFwn6VO+zRi+Z3oabQfNXFMOOrNubl1802cO58vqdS2qRO3PSYIWumqbyg=").then(desc => {console.log("Test Decrypt Promise", desc)})
       
    });
  });
  res.json(retorno);
});

router.route(rootpath).get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  var retorno = []
  connectdb.then(db => {
    let data = Chats.find({ message: "Anonymous" });
    Chats.find({}).then(chat => {
      if(use_vault){
        chat.forEach((item) => {
           if (item.message.startsWith("vault:")) {
           vault.decryptData(item.message).then((msg) => {
            item.message = msg
             retorno.push(item)
           });
           console.log(item.message);
           };
          })
       }else{
          retorno = chat
       }
       vault.decryptData("vault:v1:CycXZVBlwsMBwi4PW8LE6FbqIqRH/UFwn6VO+zRi+Z3oabQfNXFMOOrNubl1802cO58vqdS2qRO3PSYIWumqbyg=").then(desc => {console.log("Test Decrypt Promise", desc)})
    });
  });
  res.json(retorno);
});

module.exports = router;
