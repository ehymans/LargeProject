const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
console.log("here");
const path = require('path');    // MAY NEED TO DELETE!!       
const PORT = process.env.PORT || 3000;  


const app = express();

app.set('port', (process.env.PORT || 3000));

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();
var api = require('./api.js');
api.setApp( app, client );
// edit so it does not await the API call.
app.options('*', cors()); // Respond to preflight requests
console.log("here2");

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});


///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });

  console.log("here3");

}