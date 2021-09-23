var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var users = [];
var count = 0;
io.on('connection', (socket) => {
    console.log("A user Connected");
    count++
    io.sockets.emit('broadcast',{description: count});
    socket.on('setUsername', (data) => {
        if(users.indexOf(data) > -1){
            socket.emit('userExist', data + " username is taken! Try some other username..")
        }else{
            users.push(data);
            console.log(users);
            socket.emit('userSet', { username: data});
        }
    });
    socket.on('msg', function(data){
        io.sockets.emit('newmsg', data);
     });

     socket.on('disconnect', function () {
        console.log(users);
        count--;
        io.sockets.emit('broadcast',{ description: count });
     });
})


http.listen(8081, () => {
    console.log('server running on port: 8081');
});