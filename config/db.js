const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URL;
    if (!mongoURI) {
      throw new Error("MONGO_URL environment variable is not set");
    }
    
    console.log(`Attempting to connect to MongoDB with URI: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Connected To DATABASE ${mongoose.connection.host}`.bgCyan.white
    );
  } catch (error) {
    console.log(`Error in connection DB: ${error.message}`.bgRed.white);
    process.exit(1); // Exit the process with a failure
  }
};

module.exports = connectDB;
