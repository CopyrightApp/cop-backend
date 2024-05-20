const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors()); 
app.use(express.json());
const port = process.env.PORT || 4000;

app.get("/", (req,res) => {res.send("Server is running")})

let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log('Server in running on port', port);
  });
}

module.exports = server ? server : app;