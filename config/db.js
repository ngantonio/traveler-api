import mongoose from 'mongoose'
import * as dotenv from "dotenv";
dotenv.config({ path: './config/variables.env' });


export default function connectDB() {
  mongoose.connect(process.env.DB_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then((success) => {
    console.log("Database connected Sucessfully");
    
  }).catch((err) => {
    console.log("Database connection failed ");
      console.log(err);
      process.exit(1); // Stop app
  });
};



