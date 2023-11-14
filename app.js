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

var con = mysql.createConnection({
    host: "localhost",
    port: "3307",
    user: "root",
    password: "quiz",
    database: "quiz_db"
  });

  
  con.connect(function(err) {
    if (err) throw err;
    console.log('connected to db')
    con.query("SELECT * FROM question ORDER BY question LIMIT 1 OFFSET 0;", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0])
    })});

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.emit('message', 'connection online big man')
    socket.on('disconnect', function(){
        console.log('he died lol')
        con.query(`DELETE FROM users WHERE id LIKE '${socket.id}';`, function (err, result, fields) {
            if (err) throw err;
            con.destroy()
        })
    });
    socket.on('namecall', (data) => {
        console.log(`Name from ${socket.id}: ${data}`)
        con.connect(function(err) {
            if (err) throw err;
            console.log('connected to db for insertion ;)')
            con.query(`INSERT INTO users (${socket.id}, ${data}, 0);`, function (err, result, fields) {
                if (err) throw err;
                con.destroy()
            })});
        socket.on('message', (data) => {
            console.log(`mesage from ${data.id} (${socket.id}): ${data.message}`)
            socket.emit('message', `msg received: ${data.message}`)
        })
    })
    // socket.emit('ans', res[0])
})