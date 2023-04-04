const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var mongourl = process.env.MONGODB_SERVER || "localhost";
var port = process.env.MONGODB_PORT || 27017;
var username = process.env.MONGODB_USERNAME || "";
var password = process.env.MONGODB_PASSWORD || "";
var url = ""
// 
 
 if(username != "" && password != ""){
     url = "mongodb://" + username + ":" + password + "@"+ mongourl + ":" + port + "/chat";
    //const connect = mongoose.connect(url, { useNewUrlParser: true });
    // const connect = mongoose.connect(url+"?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false", { useNewUrlParser: true, tlsCAFile: `./rds-combined-ca-bundle.pem` });
 }
 else
 {
     url = "mongodb://" + mongourl + ":" + port + "/chat";
    //const connect = mongoose.connect(url, { useNewUrlParser: true });
 }

// mongodb://<sample-user>:<password>@sample-cluster.node.us-east-1.docdb.amazonaws.com:27017/sample-database?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false

//const connect = mongoose.connect("mongodb://docadmin:YourPwdShouldBeLongAndSecure!@docdb-test.ck4qnrbriwav.eu-west-1.docdb.amazonaws.com:27017/?ssl=true&tlsCAFile=rds-combined-ca-bundle.pem&retryWrites=false", { useNewUrlParser: true, tlsCAFile: "rds-combined-ca-bundle.pem" });
var connect = mongoose.connect(url, { useNewUrlParser: true });
module.exports = connect;
