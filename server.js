const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const WebSocket = require('ws');
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

  api.setApp(app, client);


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

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to broadcast messages to all connected clients
function broadcastUpdate(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
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
