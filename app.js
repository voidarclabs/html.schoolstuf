const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(900, () => {
    console.log("Server successfully running on port idk anymore");
  });


  function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    // Make a POST request to the server
    fetch('http://localhost:3000/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data.response);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });

    // Clear the input field
    messageInput.value = '';
}