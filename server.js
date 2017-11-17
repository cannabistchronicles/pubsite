var express = require('express');
var app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var blog_route = require('./routes/blog.js');
init();

app.use('/', blog_route);

// parse application/x-www-form-urlencoded 

// parse application/json 
function init() {
    mongoose.connect('mongodb://104.154.207.204:27017/blog'); 
    //mongoose.connect('mongodb://slabby:36lx4mDRu2dko6es@cluster0-shard-00-00-xbnzf.mongodb.net:27017,cluster0-shard-00-01-xbnzf.mongodb.net:27017,cluster0-shard-00-02-xbnzf.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',{useMongoClient: true});
     var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
     db.once('open', function() {

    });
}
app.use('/', express.static('/client'));
app.listen(80);