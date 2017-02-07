/**
 * Created by pavluhin on 10.11.2016.
 */

var app = require('express')();
var express =require('express');
var http = require('http').Server(app);
var io = require('socket.io').listen(8888);



app.use(express.static(__dirname + '/public'));
app.listen(8080);

var socketsArr=[];
var idArr=[];
var point={x:0,y:0}
io.on('connection', function(socket){
    console.log('a user connected');
    socketsArr.push(socket);
    var ID=socket.id;
    idArr.push(ID);
    point.x+=10;
    for(var i=0;i<socketsArr.length;i++){
        socketsArr[i].json.send({'event': 'connected', 'name': idArr,'point':point});
    }
    io.on('alive', function (name, fn) {

    });
});

io.on('disconnect', function (socket) {
    io.emit('user disconnected');
});


// var http = require("http");
// var express = require('express');
// var app = express();
// var io = require('socket.io').listen(8888);
//
// app.use(express.static(__dirname + '/public'));
// app.listen(8080);
//
//
// io.sockets.on('connection', function (socket) {
//     var ID = (socket.id).toString().substr(0, 5);
//     var time = (new Date).toLocaleTimeString();
//     socket.json.send({'event': 'connected', 'name': ID, 'time': time});
// });
