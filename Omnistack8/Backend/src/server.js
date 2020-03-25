const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();   
const server = require('http').Server(app); // Para extrair o servidor http de dentro do express
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  console.log(user, socket.id);

  connectedUsers[user] = socket.id;

  /* Princípio de web socket
  console.log('Nova conexão', socket.id);
  socket.on('hello', message => {
    console.log(message)
  })
  setTimeout(() => {
    socket.emit('world', {
      message: 'OmniStack'
    });
  }, 5000)
  */
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster-xm0xw.mongodb.net/omnistack8?retryWrites=true&w=majority', {
  useNewUrlParser: true  
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);    //Porta de conexão