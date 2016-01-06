var mongoose = require('mongoose');
var conn = "mongodb://localhost/db";

db =  mongoose.createConnection(conn);
module.exports = db;