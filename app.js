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
	if (err) throw err
});


con.query("SELECT question FROM question ORDER BY question LIMIT 1 OFFSET 0;", function (err, result, fields) {
    if (err) throw err;
    console.log(result[0])})

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.emit('message', 'connected to websocket server')

    socket.on('disconnect', function(){
        console.log(`User with socket id ${socket.id} has disconnected.`)

        con.query(`DELETE FROM users WHERE id LIKE '${socket.id}';`, function (err, result, fields) {
            if (err) throw err;
        })
    });
    socket.on('namecall', (data) => {
        console.log(`Name from ${socket.id}: ${data}`)

        if ()
        con.query(`INSERT INTO users (id, clientname, score) VALUES ('${socket.id}', '${data}', 0);`, function (err, result, fields) {
            if (err) throw err;
            console.log('added row')
    })
    socket.on('message', (data) => {
        console.log(`mesage from ${data.id} (${socket.id}): ${data.message}`)
        socket.emit('message', `msg received: ${data.message}`)
    })
})})