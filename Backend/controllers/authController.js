import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if user already exists
    const userExists = await userModel.findOne({ username }) || await userModel.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    return res.status(201).json({ message: 'User registered successfully' });
}

export const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'You are not registered' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role : user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ message: 'Login successful', token });

}