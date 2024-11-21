const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


const mongoUrl = process.env.MONGO_URL; 

mongoose.connect(mongoUrl).then(() => {
    console.log("MongoDB successfully connected");
}).catch((e) => {
    console.error("Failed to connect to MongoDB", e);
});

// Root route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});








// Start the server
app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
