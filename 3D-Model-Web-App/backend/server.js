const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MySQL database connection
const dbase = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "model_web_app_database"
});

dbase.connect((err) => {
    if (err) {
        console.log("Error connecting to the MySQL database:", err);
        return;
    }
    console.log("Database Connected!");
});

// Login route
app.post('/user_account', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const query = "SELECT * FROM user_account WHERE email = ?";
    
    // Query to find user by email
    dbase.query(query, [email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // Check if user exists
        if (data.length > 0) {
            const user = data[0];

            // Compare password with hashed password in database
            bcrypt.compare(password, user.pass_word, (err, isMatch) => {
                if (err) {
                    console.error("Bcrypt error:", err);
                    return res.status(500).json({ message: "Bcrypt error" });
                }

                if (isMatch) {
                    // Generate JWT token with user ID and role
                    const token = jwt.sign({ userid: user.userid, role: user.role }, "jwt-secret-key", { expiresIn: '1d' });
                    
                    // Set token as HTTP-only cookie
                    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Secure flag for production
                    res.json({ message: "Login successful", role: user.role, data: user });
                } else {
                    res.status(401).json({ message: "Invalid email or password" });
                }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    });
});

// Logout route
app.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT cookie
    res.json({ message: "Logged out successfully" });
});

// Middleware to verify the JWT token
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Error: "You are not authed!" });
    }
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Token is not valid" });
        }
        req.userid = decoded.userid; // Attach userid to request object
        req.role = decoded.role; // Attach role to request object
        next();
    });
};

// Route to get user information
app.get('/user_info', verifyUser, (req, res) => {
    const query = "SELECT * FROM user_info_data WHERE userid = ?";
    dbase.query(query, [req.userid], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (data.length > 0) {
            return res.json(data[0]);
        } else {
            return res.status(404).json({ message: "User info not found" });
        }
    });
});

// Route to get all user accounts (admin only)
app.get('/user_accounts', verifyUser, (req, res) => {
    // Check if the user has admin role
    if (req.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }

    const query = "SELECT * FROM user_account WHERE userid <> 1"; // Fetch all user accounts
    dbase.query(query, (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.json({ authenticated: true, role: req.role, accounts: data });
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Listening on port 8081");
});
