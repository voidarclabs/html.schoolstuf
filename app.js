const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(80, () => {
    console.log("Server successfully running on port 80");
  });

window.addEventListener('message', function(event) {
// Log the message received from the iframe
console.log('URL received:', event.data);
});