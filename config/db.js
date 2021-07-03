const mongoose = require('mongoose');
require('dotenv').config({ path: './config/variables.env' });


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.log("Database connected Sucessfully");
      
  } catch (err) {
    console.log(err);
    process.exit(1); // Stop app
  }
  
}

module.exports = connectDB;