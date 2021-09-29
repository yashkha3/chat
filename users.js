const users = [];

module.exports.add = ({id, name, room}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if(room == ""){
        room = "broadcast"
    }

    const userExist = users.find((user) => user.room === room && user.name === name);
    if(userExist){
        return {
            error: `${name} is already in ${room}, change username to get in..`
        }
    }else{
        const user = {id, name, room};
        users.push(user);
        console.log(users)
        return { user };
    }
};

module.exports.remove = (id) => {
    const index = users.findIndex((user) => user.id === id );
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
};

module.exports.getUser = (id) => users.find((user) => user.id === id);

module.exports.getUsersInRoom = (room) => users.filter((user) => user.room === room);