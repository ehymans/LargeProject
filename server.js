const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const WebSocket = require('ws');

// new (11-22-23) websocket essential vars
const URL = require('url'); // Renamed to avoid conflict with existing 'url' variable
const userConnections = new Map(); // Map to store user ID and WebSocket connection

const http = require('http');

const PORT = process.env.PORT || 5000; 

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

try 
{
  require("dotenv").config();

  const url = process.env.MONGODB_URI;

  const MongoClient = require("mongodb").MongoClient;

  const client = new MongoClient(url);

  client.connect(console.log("mongodb connected"));

  var api = require("./api.js");

  api.setApp(app, client, broadcastUpdate);

} 
catch (e) 
{
  console.log(e.message);
}
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// ping-pong heartbeat logic (bc of dumb heroku rules)
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000); // Ping every 30 seconds

wss.on('connection', function connection(ws, req) {
  // Extract userId from query parameters
  const queryParams = URL.parse(req.url, true).query;
  const userId = queryParams.userId;

  if (userId) {
    userConnections.set(userId, ws); // Store the connection with the userId
  }

  ws.isAlive = true;
  ws.on('pong', function heartbeat() {
    ws.isAlive = true;
  });

  // Your existing WebSocket 'connection' logic goes here
  console.log('Client connected to WebSocket');

  ws.on('close', () => {
    console.log('Client disconnected');
    if (userId) {
      userConnections.delete(userId); // Remove the connection when it's closed
    }
  });
});

/*
wss.on('close', function close() 
{
  clearInterval(interval);
});*/


/*
// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});*/

// Function to broadcast messages to all connected clients
function broadcastUpdate(userId, data) 
{
  const message = JSON.stringify({ type: 'update', payload: data, userId });
  const client = userConnections.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
}


//
// Export the broadcast function to use in other parts of your application
//module.exports = { broadcastUpdate };
//
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https')
    res.redirect(`https://${req.header('host')}${req.url}`)
  else
    next();
});

// Replace app.listen with server.listen
server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });

}
// Export the broadcast function to use in other parts of your application
module.exports = { broadcastUpdate };
console.log(broadcastUpdate);