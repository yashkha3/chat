var express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

app.set('views', './views');
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('index');
});

const { add, remove, getUser, getUsersInRoom } = require('./users');

var count = 0;
io.on('connection', (socket) => {
    count++
    console.log(count);
    // io.emit('broadcast', count);
    socket.on('setUsername', (data) => {
        if(data.name == ""){
            socket.emit('name_notification', `Please Enter Username`);
        }else{
            const {error, user} = add({id: socket.id, name: data.name, room: data.room});
            if(error){
                socket.emit('userExist', error);
            }else{ 
                socket.join(user.room)
                socket.emit('roomSetup', user);
                socket.emit('in_notification', `${user.name} Welcome to ${user.room} Room.`);
                io.to(user.room).emit('roomData', getUsersInRoom(user.room));
                io.to(user.room).emit('in_info',`${user.name} Joined`);
            }
        }
    });
    socket.on('msg', (data) => {
        const user = getUser(socket.id);
        io.to(socket.id).emit('send_msg', {user: user.name, message: data});
        io.to(user.room).emit('recive_msg', {user: user.name, message: data, socket_id: socket.id});
     });

     socket.on('disconnect', () => {
        const user = remove(socket.id);
        if(user){
            io.to(user.room).emit('out_info',`${user.name} Leaved`);
            io.to(user.room).emit('roomData', getUsersInRoom(user.room));
        }  
        count--
        console.log(count);
     });
})


http.listen(process.env.port, () => {
    console.log('server running on port: process.env.port');
});
