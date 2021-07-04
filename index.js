import express, {json} from "express";
import connectDB from './config/db.js';
import cors from 'cors';

import postRoutes from './src/routes/Note.routes.js'

// create server
const api = express();
const PORT = process.env.PORT || 4000;

// connect to DB
connectDB();

// cors enabling
api.use(cors());

// configure middlewares
api.use(json({ limit: "30mb", extended: true }))

// Create and configure routes and Endpoints 
api.use('/api/notes', postRoutes)

// server listenind
api.listen(PORT, () => {
  console.log(`Server listen at port ${ PORT }`);
})