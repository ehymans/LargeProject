console.log("here");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); // MAY NEED TO DELETE!!
const PORT = process.env.PORT || 5000; 

const app = express();
app.use(cors());
app.use(bodyParser.json());

try {
  console.log("here");
  require("dotenv").config();
  console.log("here2");
  const url = process.env.MONGODB_URI;
  console.log(url);
  console.log("here3");
  const MongoClient = require("mongodb").MongoClient;
  console.log("here4");
  const client = new MongoClient(url);
  console.log("here5");
  client.connect(console.log("mongodb connected"));
  console.log("here6");
  var api = require("./api.js");
  console.log("here7");
  api.setApp(app, client);
  console.log("here8");
  console.log("here2");

  // edit so it does not await the API call.
} catch (e) {
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
console.log("here3");

app.listen(PORT, () => {
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

  console.log("here3");
}
