import express, {json} from "express";
import connectDB from './config/db.js';
import cors from 'cors';

import postRoutes from './src/routes/Post.routes.js'

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
api.use('/api/posts', postRoutes)

// server listenind
api.listen(PORT, () => {
  console.log(`Server listen at port ${ PORT }`);
})