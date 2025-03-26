const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const USERS_FILE = "users.json";
const loadUsers = () => JSON.parse(fs.readFileSync(USERS_FILE));

// 🔹 Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const user = users.find((u) => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, message: "Login successful" });
});

// 🔹 Serve Login Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
