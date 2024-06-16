const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

var mongourl = process.env.MONGODB_SERVER || "localhost";
var port = process.env.MONGODB_PORT || 27017;
var username = process.env.MONGODB_USERNAME || "";
var password = process.env.MONGODB_PASSWORD || "";
var mongotls = process.env.MONGODB_TLS || false;
var mongoAuthDB = process.env.MONGODB_AUTHDB || "";

var url = ""
var connect
if(username != "" && password != "") {
  // do we need to athenticate with a different database?
  adminParam = mongoAuthDB != "" ? "&authSource=" + mongoAuthDB : "";
  
  url = "mongodb://" + username + ":" + password + "@"+ mongourl + ":" + port + "/chat?tls=" + mongotls + "&retryWrites=false" + adminParam;
  
  console.log(url);
  connect = mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true });
} else {
  url = "mongodb://" + mongourl + ":" + port + "/chat?retryWrites=false";
  
  console.log(url);
  connect = mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true });
}

module.exports = connect;