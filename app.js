const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const mysql = require('mysql');

const app = express();

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const server = app.listen(900, () => {
    console.log('Server running!')
});

const io = socketio(server)

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.emit('message', 'connection online big man')
    socket.on('namecall', (data) => {
    console.log(`Name from ${socket.id}: ${data}`)
})
})

const connection = mysql.createConnection({
    host: 'http://192.168.1.118:3307',
    user: 'admin',
    password: 'toor',
    database: 'question_db'
  });
  
connection.connect((err) => {
if (err) throw err;
console.log('Connected to the remote database!');
});