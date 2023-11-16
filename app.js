const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const mysql = require('mysql');
const { type } = require('os');
const { escape } = require('querystring');

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '/'));
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
    con.query('DELETE FROM users;')
});


con.query("SELECT * FROM question ORDER BY question LIMIT 1 OFFSET 0;", function (err, result, fields) {
    if (err) throw err;
    console.log(result[0].question)})

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('chatwindow', () => {
        socket.emit()
    })
    socket.emit('messageconnect', 'connected to websocket server')

    function quizquestion() {
        con.query("SELECT * FROM question ORDER BY question LIMIT 1 OFFSET 0;", function (err, result, fields) {
            if (err) throw err;
            console.log(result[0])
            io.sockets.emit('questionsend', result[0])
            let correctans = result[0].correctans
            socket.on('ans', (data) => {
                console.log(data)
                if (data == correctans) {
                    socket.emit('ansreturn', 'correct')
                    console.log('correct answer from: ' + socket.id)
                    con.query(`SELECT score FROM users WHERE id='${socket.id}'`, function (err, result, fields) {
                        if (err) throw (err);
                        score = result[0].score + 1
                        console.log(score)
                        con.query(`UPDATE users SET score = '${score}' WHERE id="${socket.id}";`, function (err, result, fields) {
                            if (err) throw err;
                        })
                    })
                } else {
                    socket.emit('ansreturn', 'incorrect')
                    console.log('incorrect answer from: ' + socket.id)
                }
            })
    })}

    socket.on('startquiz', () => {
        console.log('quiz started')
        console.log(parseInt(con.query('SELECT COUNT(*) FROM question;')))
        for (let step = 0; step < 5; step++) {
            console.log(step);
            console.log('hello')
          }

})

    socket.on('disconnect', function(){
        console.log(`User with socket id ${socket.id} has disconnected.`)

        con.query(`DELETE FROM users WHERE id LIKE '${socket.id}';`, function (err, result, fields) {
            if (err) throw err;
        })
    });
    socket.on('namecall', (data) => {
        console.log(`Name from ${socket.id}: ${data}`)

        con.query(`INSERT INTO users (id, clientname, score) VALUES ('${socket.id}', '${data}', 0);`, function (err, result, fields) {
            if (err) throw err;
            console.log('added row')
    })
    socket.on('message', (data) => {
            console.log(`mesage from ${data.id} (${socket.id}): ${data.message}`)
            socket.emit('message', `msg received: ${data.message}`)
            io.sockets.emit('chatmessage', '<span id="sender">' + data.id + ':</span> ' + data.message)
        })
})})