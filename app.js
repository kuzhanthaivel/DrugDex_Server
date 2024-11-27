const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { User, Admin, DrugData } = require('./Schema');

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

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});

app.post('/upload', async (req, res) => {
    try {
        const { drugName, description, uses, indications, sideEffects, warnings } = req.body;

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
    const { username, password } = req.body;


    if (!username || !password) {
        return res.status(400).json({
            message: 'Both username and password are required.',
        });
    }

    try {

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found. Please register first.',
            });
        }
        if (existingUser.password !== password) {
            return res.status(401).json({
                message: 'Invalid password. Please try again.',
            });
        }


        res.status(200).json({
            message: 'Login successful',
            user: {
                username: existingUser.username,
                email: existingUser.email,
              password: existingUser.password, 
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

app.get('/show-bookmarks/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        // If the user doesn't exist
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }

        // Send the bookmarks as response
        res.status(200).json({
            message: 'Bookmarks retrieved successfully.',
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({
            message: 'Internal server error, please try again later.',
            error: error.message,
        });
    }
});

app.post('/add-bookmark', async (req, res) => {
    const { username, drugName } = req.body;

    if (!username || !drugName) {
        return res.status(400).json({ error: "Username and drugName are required." });
    }

    try {
        // Assuming you're using MongoDB with Mongoose
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Add bookmark if not already bookmarked
        if (!user.bookmarks.includes(drugName)) {
            user.bookmarks.push(drugName);
            await user.save();
        }

        res.status(200).json({ message: "Bookmark added successfully.", isBookmarked: true });
    } catch (error) {
        console.error("Error adding bookmark:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post('/remove-bookmark', async (req, res) => {
    const { username, drugName } = req.body;

    if (!username || !drugName) {
        return res.status(400).json({ error: "Username and drugName are required." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Remove bookmark
        user.bookmarks = user.bookmarks.filter((bookmark) => bookmark !== drugName);
        await user.save();

        res.status(200).json({ message: "Bookmark removed successfully.", isBookmarked: false });
    } catch (error) {
        console.error("Error removing bookmark:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post('/check-bookmark', async (req, res) => {
    const { username, drugName } = req.body;
    if (!username || !drugName) {
        return res.status(400).json({
            message: 'Both username and drugName are required.',
        });
    }
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }
        // Check if the drug is in the user's bookmarks
        const isBookmarked = user.bookmarks.some(
            (bookmark) => bookmark.drugName === drugName
        );

        if (isBookmarked) {
            return res.status(200).json({
                message: 'Drug is bookmarked.',
                isBookmarked: true,
            });
        } else {
            return res.status(200).json({
                message: 'Drug is not bookmarked.',
                isBookmarked: false,
            });
        }
    } catch (error) {
        console.error('Error checking bookmark:', error);
        res.status(500).json({
            message: 'Failed to check bookmark.',
            error: error.message,
        });
    }
});

app.put('/edit-username', async (req, res) => {
    const { currentUsername, newUsername } = req.body;

    // Validate request data
    if (!currentUsername || !newUsername) {
        return res.status(400).json({
            message: 'Both currentUsername and newUsername are required.',
        });
    }

    try {
        // Find the user by current username
        const user = await User.findOne({ username: currentUsername });

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }

        // Check if the new username already exists
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(409).json({
                message: 'The new username is already taken. Please choose another.',
            });
        }

        // Update the username
        user.username = newUsername;
        await user.save();

        res.status(200).json({
            message: 'Username updated successfully.',
            user: { username: user.username, email: user.email },
        });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({
            message: 'Failed to update username.',
            error: error.message,
        });
    }
});

app.put('/edit-password', async (req, res) => {
    const { username, newPassword } = req.body;

    // Validate request data
    if (!username || !newPassword) {
        return res.status(400).json({
            message: 'Both username and newPassword are required.',
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

        // Update the password
        user.password = newPassword; // Note: For real-world applications, ensure password is hashed.
        await user.save();

        res.status(200).json({
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            message: 'Failed to update password.',
            error: error.message,
        });
    }
});

app.get('/search-drug', async (req, res) => {
    const { drugName } = req.query;

    if (!drugName) {
        return res.status(400).json({
            message: 'Drug name is required.',
        });
    }

    try {
        const drug = await DrugData.findOne({ drugName: { $regex: new RegExp(`^${drugName}$`, 'i') } });
        if (!drug) {
            return res.status(404).json({
                message: 'Drug not found.',
            });
        }

        res.status(200).json({
            drug: {
                drugName: drug.drugName,
                description: drug.description,
                uses: drug.uses,
                indications: drug.indications,
                sideEffects: drug.sideEffects,
                warnings: drug.warnings,
            },
        });
    } catch (error) {
        console.error('Error fetching drug:', error);
        res.status(500).json({
            message: 'Internal server error.',
            error: error.message,
        });
    }
});

app.get('/get-user', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        // Fetch user details based on the username
        const user = await User.findOne({ username }).select('email password -_id'); // Select only email and password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User details fetched successfully', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
});

