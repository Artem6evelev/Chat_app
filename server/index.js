const express = require("express");
const socket = require("socket.io");
const app = express();
const port = process.env.PORT || 3002
const cors = require("cors");

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'sql6.freesqldatabase.com',
    user : 'sql6418631',
    password : 'h1t9QYzE9J',
    database : 'sql6418631',
    port : '3306'
  }
});

app.use(cors());
app.use(express.json());

const server = app.listen(port, () => {
  console.log("Server Running on Port 3002...");
});

io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User Joined Room: " + data);
  });

  socket.on("send_message", (data) => {

    knex('users')
     .insert([
       {email: data.content.email ,
       room: data.room ,
       author: data.content.author ,
       message: data.content.message }
     ])
     
    .then( userData => {
      socket.to(data.room).emit("receive_message", data.content);
      // console.log('userData:', userData)
    })
    .catch(err => {
      console.log(err)
    })

    console.log(data);
    // socket.to(data.room).emit("receive_message", data.content);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

// app.get('/test', (req,res) => {
//   const data = knex('test')
//   .select('*')
//   data.then( test => {
//     res.send(test)
//   })
//   .catch(err => {
//     console.log(err)
//   })
// })
