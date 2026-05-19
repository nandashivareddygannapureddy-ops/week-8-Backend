import exp from "express";
import crypto from "crypto";

export const UserApp = exp.Router();

// In-memory array to store users
let usersArray = [];

// create User
UserApp.post("/user", (req, res) => {
    const newUser = req.body;
    
    // basic validation
    if (!newUser.name || !newUser.email || !newUser.dateOfBirth) {
        return res.status(400).json({ 
            message: "Validation failed", 
            errors: { message: "name, email, and dateOfBirth are required" } 
        });
    }

    // check if email already exists
    const emailExists = usersArray.find(u => u.email === newUser.email && u.status !== false);
    if (emailExists) {
        return res.status(409).json({ message: "Duplicate field value" });
    }

    // add id and status
    newUser.id = crypto.randomUUID();
    newUser.status = true;

    usersArray.push(newUser);
    res.status(201).json({ message: "User created successfully", user: newUser });
});

// Read all Users
UserApp.get("/user", (req, res) => {
    // get all active users
    const activeUsers = usersArray.filter(u => u.status === true);
    res.status(200).json({ message: "Users fetched successfully", payload: activeUsers });
});

// Read user by ID
UserApp.get("/user/:id", (req, res) => {
    const user = usersArray.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", payload: user });
});

// Delete user by ID (soft delete)
UserApp.delete("/user/:id", (req, res) => {
    const user = usersArray.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.status = false;
    res.status(200).json({ message: "User deleted successfully" });
});

// activate user (change status to true)
UserApp.patch("/user/:id", (req, res) => {
    const user = usersArray.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.status = true;
    res.status(200).json({ message: "User activated successfully", payload: user });
});