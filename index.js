

const http = require("http");
const express = require('express')

const cors = require('cors')
const socketIo = require ('socket.io')

const app = express();

const port = 4500 || process.env.PORT;

const server=http.createServer(app);

const users = {};

app.use(cors())
app.get("/",(req, res)=>{
    res.send("Hi Node SERVER how are you")
})

const io =socketIo(server);

io.on('connection',(socket)=>{
    console.log("new connection");

    socket.on("joined" ,({user}) =>{
       users[socket.id] =user;
       console.log(`${user} has joined`)
       socket.emit('welcome',{user:"Admin" ,message:`${users[socket.id]} welcome to the chat`});   
       socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`})
    });

    
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })

   

})

server.listen(port,() => {
    console.log(`server is working on http://localhost:${port}`)
})


