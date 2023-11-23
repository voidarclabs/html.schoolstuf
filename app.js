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

    // function quizquestion(step) {
    //     con.query(`SELECT * FROM question ORDER BY question LIMIT 1 OFFSET ${step};`, function (err, result, fields) {
    //         if (err) throw err;
    //         console.log(result[0])
    //         io.sockets.emit('questionsend', result[0])
    //         let correctans = result[0].correctans
    //         socket.on('nextquestion', () => {
    //             console.log('next question')
    //             return
    //         })
    //         socket.on('ans', (data) => {
    //             console.log(data)
    //             if (data == correctans) {
    //                 socket.emit('ansreturn', 'correct')
    //                 console.log('correct answer from: ' + socket.id)
    //                 con.query(`SELECT score FROM users WHERE id='${socket.id}'`, function (err, result, fields) {
    //                     if (err) throw (err);
    //                     score = result[0].score + 1
    //                     console.log(score)
    //                     con.query(`UPDATE users SET score = '${score}' WHERE id="${socket.id}";`, function (err, result, fields) {
    //                         if (err) throw err;
    //                     })
    //                 })
    //             } else {
    //                 socket.emit('ansreturn', 'incorrect')
    //                 console.log('incorrect answer from: ' + socket.id)
    //             }
    //         })
    // })}

    function quizquestion(step) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM question ORDER BY question LIMIT 1 OFFSET ${step};`, function (err, result, fields) {
                if (err) {
                    reject(err);
                    return;
                }
    
                console.log(result[0]);
                io.sockets.emit('questionsend', result[0]);
                let correctans = result[0].correctans;
    
                function handleNextQuestion() {
                    console.log('next question');
                    resolve(); // Resolve the promise when 'nextquestion' is emitted
                }
    
                socket.once('nextquestion', handleNextQuestion);
    
                socket.on('ans', (data) => {
                    console.log(data);
                    if (data == correctans) {
                        socket.emit('ansreturn', 'correct');
                        console.log('correct answer from: ' + socket.id);
                        con.query(`SELECT score FROM users WHERE id='${socket.id}'`, function (err, result, fields) {
                            if (err) reject(err);
    
                            score = result[0].score + 1;
                            console.log(score);
                            con.query(`UPDATE users SET score = '${score}' WHERE id="${socket.id}";`, function (err, result, fields) {
                                if (err) reject(err);
                            });
                        });
                    } else {
                        socket.emit('ansreturn', 'incorrect');
                        console.log('incorrect answer from: ' + socket.id);
                    }
                });
            });
        });
    }
    
    // Example usage
    async function questionrun() {
        try {
            await quizquestion(1);
            return
        } catch (err) {
            console.error(err);
        }
    }

    socket.on('startquiz', (data) => {
        console.log('quiz started')
        for (let step = 0; step < parseInt(data); step++) {
            console.log(step);
            questionrun()
        }
        console.log('quiz ended')

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