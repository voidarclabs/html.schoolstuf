const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const websocketAddress = '/websocket'; // Define the WebSocket address here

const httpServer = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('public/index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.send('Welcome to the WebSocket server!');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
});

httpServer.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

httpServer.listen(900, () => {
  console.log(`Server is listening on port 900, WebSocket address: ${websocketAddress}`);
});