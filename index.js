const express = require("express");
const socket = require("socket.io");
const app = express();

var server = app.listen(4000 , () => {
    console.log("Nader is here");
})
app.use(express.static("public"));

let sockServer = socket(server);
sockServer.on("connection" , (socket)=>{
    console.log("User connected" , socket.id);
    socket.on("joining" , (roomName)=> {
        //check if room exist
        let rooms = sockServer.sockets.adapter.rooms;
        console.log(rooms);
        let room = sockServer.sockets.adapter.rooms.get(roomName);
        console.log(room);
        if (room == undefined){
            //create a room
            socket.join(roomName)
            socket.emit("created");
            console.log("New room: '"+roomName + "' is created");
        }
        else if (room.size == 1){
            //join existing room
            socket.join(roomName)
            socket.emit("joined");
            console.log(roomName +" room found, joining now")
        }
        else {
            socket.emit("full");
            console.log(roomName + " is full")
        }
    })
    socket.on("ready" , (roomName) =>{
        socket.broadcast.to(roomName).emit("ready")
        console.log("ready");
    })
    socket.on("candidate" , (roomName , candidate) =>{
        socket.broadcast.to(roomName).emit("candidate" , candidate)
        console.log("candidate");
    })
    socket.on("offer" , (roomName , offer) =>{
        socket.broadcast.to(roomName).emit("offer" , offer)
        console.log(offer + "hiiiii offeerrrr");
    })
    socket.on("answer" , (roomName , answer) =>{
        socket.broadcast.to(roomName).emit("answer" , answer)
        console.log("answer")
    })

})


