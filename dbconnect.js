const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var mongourl = process.env.MONGODB_SERVER;
var port = process.env.MONGODB_PORT;

const url = "mongodb://" + mongourl + ":" + port + "/chat";

const connect = mongoose.connect(url, { useNewUrlParser: true });

module.exports = connect;
