const mongoose = require('mongoose');
require('dotenv').config();

const conn = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI,
            {
             
            }
        );
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
};

conn();



