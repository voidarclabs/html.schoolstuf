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



  const EventEmitter = require('events');

  // Create an event emitter
  const eventEmitter = new EventEmitter();
  
  // Listen for the 'message' event
  eventEmitter.on('message', (url) => {
      console.log('URL received:', url);
      // Handle the URL as needed
  });
  
  // Simulate receiving a message (replace this with your actual logic)
  const receivedUrl = 'https://example.com';
  eventEmitter.emit('message', receivedUrl);
  