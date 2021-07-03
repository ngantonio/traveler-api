const express = require("express");
const connectDB = require('./config/db');
const cors = require('cors');

// create server
const api = express();
const PORT = process.env.PORT || 4000;

// connect to DB
connectDB();

// cors enabling
api.use(cors());

// configure middlewares
api.use(express.json({ extended: true }))

// Create and configure routes and Endpoints 


// server listenind
api.listen(PORT, () => {
  console.log(`Server listen at port ${ PORT }`);
})