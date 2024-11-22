const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { User, Admin, DrugData } = require('./Schema');



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


const mongoUrl = process.env.MONGO_URL; 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



mongoose.connect(mongoUrl).then(() => {
    console.log("MongoDB successfully connected");
}).catch((e) => {
    console.error("Failed to connect to MongoDB", e);
});


app.get("/", (req, res) => {
    res.send("Hello, World!");
});


app.listen(5001, () => {
    console.log('Server is running on port 5001');
});

app.post('/upload', upload.single('drugPhoto'), async (req, res) => {
    try {
      const { drugName, description, uses, indications, sideEffects, warnings } = req.body;
  
      // Validate drug photo
      if (!req.file) {
        return res.status(400).json({
          message: 'Drug photo is required.',
        });
      }
  
      // Check if the drug name already exists
      const existingDrug = await DrugData.findOne({ drugName });
      if (existingDrug) {
        return res.status(409).json({
          message: 'A drug with this name already exists. Please use a unique name.',
        });
      }
  
      // Save new drug data
      const drug = new DrugData({
        drugName,
        drugPhoto: req.file.buffer,
        description,
        uses: JSON.parse(uses || '[]'),
        indications: JSON.parse(indications || '[]'),
        sideEffects: JSON.parse(sideEffects || '[]'),
        warnings: JSON.parse(warnings || '[]'),
      });
  
      await drug.save();
      res.status(201).json({
        message: 'Drug uploaded successfully',
        drug,
      });
    } catch (error) {
      console.error('Error saving drug:', error.message);
      res.status(500).json({
        message: 'Failed to upload drug',
        error: error.message,
      });
    }
  });
  
  
app.post('/register-user', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'All fields (username, email, password) are required.',
        });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered. Please use a different email.',
            });
        }

        // Create a new user with plain text password (no hashing)
        const newUser = new User({
            username,
            email,
            password, // Plain text password
        });

        // Save the user to the database
        await newUser.save();


        res.status(201).json({
            message: 'User registered successfully',
            user: { username: newUser.username, email: newUser.email },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Internal server error, please try again later.',
            error: error.message,
        });
    }
});


app.post('/login-user', async (req, res) => {
    const { email, password } = req.body;

    // Validate if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            message: 'Both email and password are required.',
        });
    }

    try {
        // Find the user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found. Please register first.',
            });
        }

        // Check if the provided password matches (Note: No bcrypt used here)
        if (existingUser.password !== password) {
            return res.status(401).json({
                message: 'Invalid password. Please try again.',
            });
        }

        // Successful login, send back the user details
        res.status(200).json({
            message: 'Login successful',
            user: {
                username: existingUser.username,
                email: existingUser.email,
                password: existingUser.password, // Not recommended for production
            },
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            message: 'Internal server error, please try again later.',
            error: error.message,
        });
    }
});


app.post('/add-bookmark', async (req, res) => {
    const { username, drugName } = req.body;
  
    // Validate request data
    if (!username || !drugName) {
        return res.status(400).json({
            message: 'Both username and drugName are required.',
        });
    }
  
    try {
        // Find user by username
        const user = await User.findOne({ username });
  
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }
  
        // Check if the drug is already bookmarked
        const isBookmarked = user.bookmarks.some(
            (bookmark) => bookmark.drugName === drugName
        );
  
        if (isBookmarked) {
            return res.status(409).json({
                message: 'This drug is already bookmarked.',
            });
        }
  
        // Add new bookmark
        user.bookmarks.push({ drugName });
        await user.save();
  
        res.status(200).json({
            message: 'Drug bookmarked successfully.',
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(500).json({
            message: 'Failed to add bookmark.',
            error: error.message,
        });
    }
  });
  